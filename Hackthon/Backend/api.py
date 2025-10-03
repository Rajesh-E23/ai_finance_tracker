# backend/api.py
# Requirements: pip install uvicorn fastapi python-multipart pydantic

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from typing import Dict, List
from datetime import datetime

# Import database and ML model functions
from database import (
    get_summary, get_breakdown, load_initial_data, get_all_transactions, 
    apply_ai_predictions, save_transaction, set_budget, get_budgets, 
    get_current_month_spending, initialize_db
)
from ml_model import predict_category, train_model, clean_text

# --- FastAPI Initialization ---
app = FastAPI(
    title="AI Finance Tracker API",
    description="Backend for handling financial data, AI categorization, and core logic."
)

# --- CORS Configuration ---
# Allow all origins for development simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Schemas for Request/Response ---

class PredictionRequest(BaseModel):
    raw_text: str = Field(..., description="The raw SMS/Email text content.")

class TransactionSchema(BaseModel):
    # Used for Manual Entry (Frontend POST)
    date: str
    amount: float
    type: str  # 'expense' or 'income' from frontend
    category: str
    description: str
    # Raw text is optional for manual entry, but required for DB. 
    # We'll use the description as a placeholder for raw_text if missing.
    raw_text: str = "" 

class BudgetSchema(BaseModel):
    category: str
    monthly_limit: float

# --- Startup Event: Data and AI Initialization ---
@app.on_event("startup")
def startup_event():
    """Ensure DB and AI model are ready when the server starts."""
    print("--- SERVER STARTUP: Initializing Data and AI ---")
    
    # 1. Initialize the database schema
    initialize_db()

    # 2. Load/Clean Data (Assumes CSV is in the root directory)
    load_initial_data('raw_transactions.csv') 

    # 3. Train AI Model 
    train_model('raw_transactions.csv')

    # 4. Apply AI Predictions to UNLABELED data in the DB
    apply_ai_predictions(predict_category)

    print("--- Initialization Complete. API is Ready. ---")


# --- API Routes ---

# 1. DASHBOARD DATA
@app.get("/api/data/summary")
def get_data_summary():
    """Returns high-level metrics for the dashboard header."""
    return get_summary()

@app.get("/api/data/breakdown")
def get_data_breakdown():
    """Returns the spending breakdown for the chart."""
    return get_breakdown()

@app.get("/api/data/transactions")
def get_all_data():
    """Endpoint for showing the full processed table."""
    return get_all_transactions()


# 2. AI PREDICTION AND SAVING

@app.post("/api/predict_and_save")
def predict_and_save_endpoint(request: PredictionRequest):
    """
    Handles raw text, uses AI to predict category/amount, and saves to DB.
    NOTE: For simplicity, this acts as both prediction AND saving.
    """
    raw_text = request.raw_text
    if not raw_text:
        raise HTTPException(status_code=400, detail="Raw text input is required.")

    # --- AI Prediction ---
    predicted_category = predict_category(raw_text)
    
    # --- Simple Data Extraction (Placeholder logic - should be in ml_model) ---
    # Attempt to extract amount and type from raw text 
    amount_match = re.search(r'(\d[\d,]*\.\d{2})', raw_text)
    amount = float(amount_match.group(1).replace(',', '')) if amount_match else 0.00
    
    # Simple type detection
    type_ = 'CREDIT' if 'credit' in raw_text.lower() or 'salary' in raw_text.lower() else 'DEBIT'
    
    # Create the structured transaction object
    transaction_data = {
        "date": datetime.now().strftime('%Y-%m-%d'),
        "raw_text": raw_text,
        "amount": amount,
        "type": type_,
        "category": predicted_category,
        "description": raw_text.split('\n')[0].strip() # Use first line as description
    }

    try:
        saved_transaction = save_transaction(transaction_data)
        return saved_transaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save transaction.")

@app.post("/api/transactions")
def save_manual_transaction(transaction: TransactionSchema):
    """Saves a transaction manually entered by the user."""
    
    # Convert Frontend type ('expense'/'income') to Backend type ('DEBIT'/'CREDIT')
    db_type = 'DEBIT' if transaction.type.lower() == 'expense' else 'CREDIT'
    
    # Clean raw_text (use description as raw_text placeholder if missing)
    raw_text = transaction.raw_text or transaction.description
    
    transaction_data = {
        "date": transaction.date,
        "raw_text": raw_text,
        "amount": transaction.amount,
        "type": db_type,
        "category": transaction.category,
        "description": transaction.description
    }
    
    try:
        saved_transaction = save_transaction(transaction_data)
        return saved_transaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# 3. BUDGET ENDPOINTS
@app.get("/api/budgets")
def get_budget_status():
    """Returns current budget limits and the spending against them for the current month."""
    limits = get_budgets()
    spent = get_current_month_spending()
    
    budget_status = {}
    for category, limit in limits.items():
        budget_status[category] = {
            "limit": limit,
            "spent": spent.get(category, 0.0)
        }
        
    return budget_status

@app.post("/api/budgets")
def set_budget_endpoint(budget: BudgetSchema):
    """Sets a new monthly budget limit."""
    try:
        set_budget(budget.category, budget.monthly_limit)
        return {"status": "success", "message": f"Budget set for {budget.category}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to set budget: {e}")


# --- Execution ---
if __name__ == "__main__":
    # Command to run the server: uvicorn api:app --reload --port 8000
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)