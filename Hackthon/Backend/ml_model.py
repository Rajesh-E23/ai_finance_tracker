import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import re
import pickle
import os

# --- Configuration ---
# MODEL_PATH and VECTORIZER_PATH remain 'nb_model.pkl' etc. as they are saved to the project root
MODEL_PATH = '../nb_model.pkl' # FIX: Save model to project root
VECTORIZER_PATH = '../tfidf_vectorizer.pkl' # FIX: Save vectorizer to project root

# CRITICAL FIX: The CSV file is now assumed to be in the same folder as this script (backend/)
CSV_FILE_PATH = 'raw_transactions.csv' 

def clean_text(text):
    """Cleans the raw SMS text by removing amounts, symbols, and standardizing."""
    # Ensure text is string and handle NaN/None gracefully
    text = str(text) if pd.notna(text) else ""
    # Remove common currency symbols and numbers (like amounts or references)
    text = re.sub(r'[₹$€,]', '', text)
    text = re.sub(r'\b\d+(\.\d+)?\b', ' ', text)
    # Convert to lowercase and remove extra spaces
    text = re.sub(r'\s+', ' ', text).lower().strip()
    return text

def train_model(csv_path: str = CSV_FILE_PATH):
    """
    Loads data, trains the Naive Bayes classifier, and saves the model/vectorizer.
    """
    if not os.path.exists(csv_path):
        print(f"Error: Training data CSV not found at {csv_path}. Please ensure it is in the backend/ folder.")
        return None, None

    try:
        # 1. Load data
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return None, None

    # 2. Filter Labeled Training Data
    # Only use rows where Manual_Category is NOT NaN for training
    df_train = df.dropna(subset=['Manual_Category', 'Raw_Text']).copy()

    if df_train.empty or len(df_train) < 20:
        print("Warning: Insufficient labeled training data (< 20 rows). Categorization will be weak.")
        return None, None 

    # Clean the training text
    df_train['Clean_Text'] = df_train['Raw_Text'].apply(clean_text)

    # 3. Vectorization (TF-IDF) and Model Pipeline
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    
    # 4. Train Model
    X_train = df_train['Clean_Text']
    y_train = df_train['Manual_Category']
    
    X_vectorized = vectorizer.fit_transform(X_train)
    model = MultinomialNB()
    model.fit(X_vectorized, y_train)

    # 5. Save Model and Vectorizer (relative to project root)
    with open(MODEL_PATH, 'wb') as file:
        pickle.dump(model, file)
    with open(VECTORIZER_PATH, 'wb') as file:
        pickle.dump(vectorizer, file)
        
    print(f"AI Model trained and saved successfully. Total training samples: {len(df_train)}")
    return model, vectorizer

def load_model_and_vectorizer():
    """Loads the pre-trained model and vectorizer from disk."""
    try:
        with open(MODEL_PATH, 'rb') as model_file, open(VECTORIZER_PATH, 'rb') as vectorizer_file:
            model = pickle.load(model_file)
            vectorizer = pickle.load(vectorizer_file)
        return model, vectorizer
    except FileNotFoundError:
        print("Model files not found. Attempting to train model now...")
        return train_model(CSV_FILE_PATH)

def predict_category(raw_text: str):
    """
    Predicts the category of a single raw text input.
    Returns 'Uncategorized' if the model fails to load or predict.
    """
    model, vectorizer = load_model_and_vectorizer()

    if model is None or vectorizer is None:
        return "Uncategorized"

    cleaned_text = clean_text(raw_text)
    
    try:
        X_pred = vectorizer.transform([cleaned_text])
        prediction = model.predict(X_pred)
        return prediction[0]
    except Exception as e:
        print(f"Prediction failed for text: '{raw_text}'. Error: {e}")
        return "Uncategorized"