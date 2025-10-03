import sqlite3
import pandas as pd
import re
import os
from datetime import datetime, timedelta
from ml_model import predict_category

# Define the database path relative to the project root
DB_PATH = '../tracker.db' # FIX: Saves DB file to the main Hackthon folder
CSV_FILE_PATH = 'raw_transactions.csv' # CRITICAL FIX: Assumes CSV is in the backend/ folder

def get_db_connection():
    """Establishes and returns a connection to the SQLite database."""
    return sqlite3.connect(DB_PATH)

def initialize_db():
    """Creates the transactions and budgets tables if they don't exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Transactions Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            raw_text TEXT,
            amount REAL,
            type TEXT, -- 'CREDIT' or 'DEBIT'
            category TEXT,
            description TEXT
        )
    """)

    # 2. Budgets Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS budgets (
            category TEXT PRIMARY KEY,
            monthly_limit REAL
        )
    """)
    
    conn.commit()
    conn.close()

def load_initial_data(csv_path: str = CSV_FILE_PATH):
    """Loads and cleans data from CSV into the database, only running if the DB is empty."""
    initialize_db()

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if table is empty
    cursor.execute("SELECT COUNT(*) FROM transactions")
    if cursor.fetchone()[0] > 0:
        conn.close()
        return # Data already loaded

    try:
        df = pd.read_csv(csv_path)
    except FileNotFoundError:
        conn.close()
        print(f"Error: {csv_path} not found. Ensure it is in the backend directory.")
        return

    # --- Data Cleaning and Preparation ---
    def extract_description(text):
        """Simple extraction of a clean description."""
        text = re.sub(r'(?:Rs|INR|\$|\€)\s*\d+(?:\.\d+)?|upi|ref\s*\d+', '', str(text), flags=re.IGNORECASE)
        return text.strip()

    df['description'] = df['Raw_Text'].apply(extract_description)
    # Use Manual_Category for labeled data, otherwise NULL
    df['category'] = df['Manual_Category'].where(pd.notna, None)

    # Select columns matching the SQL schema
    df_to_load = df[['Date', 'Raw_Text', 'Amount', 'Type', 'category', 'description']]
    df_to_load.columns = ['date', 'raw_text', 'amount', 'type', 'category', 'description']

    # Insert data into SQLite
    df_to_load.to_sql('transactions', conn, if_exists='append', index=False)
    conn.close()
    print("Initial data loaded into SQLite database.")


def apply_ai_predictions(predict_func):
    """Iterates through unlabeled DB rows and uses the AI to fill the category."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Fetch unlabeled transactions (where category IS NULL)
    cursor.execute("SELECT id, raw_text FROM transactions WHERE category IS NULL")
    unlabeled_rows = cursor.fetchall()

    if not unlabeled_rows:
        conn.close()
        return

    # 2. Iterate and predict
    updates = []
    for row_id, raw_text in unlabeled_rows:
        predicted_category = predict_func(raw_text)
        updates.append((predicted_category, row_id))

    # 3. Batch Update (Efficient SQL)
    cursor.executemany("UPDATE transactions SET category = ? WHERE id = ?", updates)
    conn.commit()
    conn.close()
    print(f"Applied {len(unlabeled_rows)} AI predictions to the database.")


# --- API Query Functions (Called by api.py) ---
# ... (All API query functions remain the same) ...

def get_summary(days=30):
    """Calculates total income, expense, and net savings for the last N days."""
    # (Implementation remains the same)
    conn = get_db_connection()
    
    date_n_days_ago = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    
    query = f"""
        SELECT amount, type, category 
        FROM transactions 
        WHERE category IS NOT NULL AND date >= '{date_n_days_ago}'
    """
    df = pd.read_sql_query(query, conn)
    conn.close()

    if df.empty:
        return {
            "total_income": 0.0,
            "total_expense": 0.0,
            "net_savings": 0.0,
            "recommendations": ["No transactions recorded in the last 30 days."]
        }

    income = df[df['type'] == 'CREDIT']['amount'].sum()
    expense = df[df['type'] == 'DEBIT']['amount'].sum()
    net_savings = income - expense

    food_spending = df[df['category'].str.contains('Food', case=False, na=False)]['amount'].sum()
    food_percent = (food_spending / expense * 100) if expense > 0 else 0

    recommendations = []
    if food_percent > 25:
        recommendations.append(f"High Food Spending: {food_percent:.1f}% of total expenses. Consider a budget review.")
    if net_savings > 0:
        recommendations.append(f"Excellent! Your net savings are positive for the last {days} days.")
    if not recommendations:
        recommendations.append("Financial status is stable for the last 30 days.")

    return {
        "total_income": round(income, 2),
        "total_expense": round(expense, 2),
        "net_savings": round(net_savings, 2),
        "recommendations": recommendations
    }


def get_breakdown(days=30):
    """Returns spending by category for the pie chart for the last N days."""
    # (Implementation remains the same)
    conn = get_db_connection()
    
    date_n_days_ago = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    
    query = f"""
        SELECT SUM(amount) as total, category 
        FROM transactions 
        WHERE type='DEBIT' 
          AND category IS NOT NULL 
          AND date >= '{date_n_days_ago}'
        GROUP BY category
    """
    df = pd.read_sql_query(query, conn)
    conn.close()

    breakdown = df.set_index('category')['total'].to_dict()
    return {k: float(v) for k, v in breakdown.items()}


def get_all_transactions():
    """Returns all transactions for the full data table view."""
    # (Implementation remains the same)
    conn = get_db_connection()
    df = pd.read_sql_query("SELECT id, date, raw_text, amount, type, category, description FROM transactions ORDER BY id DESC", conn)
    conn.close()

    return df.to_dict('records')


def save_transaction(transaction_data: dict):
    """Saves a new transaction manually or after AI parsing."""
    # (Implementation remains the same)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    required_fields = ['date', 'raw_text', 'amount', 'type', 'category', 'description']
    if not all(field in transaction_data for field in required_fields):
        raise ValueError("Missing required transaction fields.")

    cursor.execute("""
        INSERT INTO transactions (date, raw_text, amount, type, category, description)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        transaction_data['date'], 
        transaction_data['raw_text'], 
        transaction_data['amount'], 
        transaction_data['type'], 
        transaction_data['category'], 
        transaction_data['description']
    ))
    
    transaction_data['id'] = cursor.lastrowid
    conn.commit()
    conn.close()
    return transaction_data

# --- Budget Functions ---

def set_budget(category: str, monthly_limit: float):
    """Adds or updates a monthly budget limit for a category."""
    # (Implementation remains the same)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT OR REPLACE INTO budgets (category, monthly_limit)
        VALUES (?, ?)
    """, (category, monthly_limit))
    
    conn.commit()
    conn.close()
    return {"category": category, "monthly_limit": monthly_limit}

def get_budgets():
    """Retrieves all budget limits."""
    # (Implementation remains the same)
    conn = get_db_connection()
    df = pd.read_sql_query("SELECT category, monthly_limit FROM budgets", conn)
    conn.close()
    
    return df.set_index('category')['monthly_limit'].to_dict()


def get_current_month_spending():
    """Calculates spending for the current month by category."""
    # (Implementation remains the same)
    conn = get_db_connection()
    
    today = datetime.now()
    first_day_of_month = today.strftime('%Y-%m-01')
    
    query = f"""
        SELECT SUM(amount) as spent, category 
        FROM transactions 
        WHERE type='DEBIT' 
          AND category IS NOT NULL 
          AND date >= '{first_day_of_month}'
        GROUP BY category
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    return df.set_index('category')['spent'].to_dict()

# --- Initialization ---
initialize_db()