# Import necessary libraries
import logging
from google.cloud import bigquery
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import joblib

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize BigQuery Client
client = bigquery.Client()

    # LIMIT 1000  -- Adjust the number to get a smaller subset (for checking the ML model)

def load_data_from_bigquery():
    """
    Load data from BigQuery into a Pandas DataFrame.
    """
    query = """
    SELECT
        Severity,
        Start_Lat,
        Start_Lng,
        EXTRACT(DAYOFWEEK FROM Start_Time) AS DayOfWeek,
        EXTRACT(HOUR FROM Start_Time) AS HourOfDay,
        Weather_Condition,
        Temperature_F_,
        Visibility_mi_
    FROM `data-driven-highway.data_driven_highway_dataset.optimized_table`

    """
    query_job = client.query(query)
    df = query_job.to_dataframe()
    logging.info("Data loaded successfully.")
    return df

def preprocess_data(df):
    """
    Preprocesses the input DataFrame.
    """
    logging.info("Starting to preprocess data...")

    # Define numerical and categorical columns
    numerical_cols = ['Start_Lat', 'Start_Lng', 'Temperature_F_', 'Visibility_mi_']
    categorical_cols = ['DayOfWeek', 'HourOfDay', 'Weather_Condition']

    # Preprocessing for numerical data: Standard Scaling
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())])

    # Preprocessing for categorical data: One-hot encoding
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))])

    # Bundle preprocessing for numerical and categorical data
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_cols),
            ('cat', categorical_transformer, categorical_cols)])

    logging.info("Data preprocessing completed.")
    return preprocessor

def train_model(X_train, y_train, preprocessor):
    logging.info("Training model.")

    smallest_class_size = y_train.value_counts().min()
    logging.info(f"The smallest class size is: {smallest_class_size}")

    if smallest_class_size < 2:
        logging.warning("Skipping SMOTE due to insufficient samples in the least populated class.")
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('model', model)
        ])
    else:
        k_neighbors = smallest_class_size - 1
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        pipeline = ImbPipeline(steps=[
            ('preprocessor', preprocessor),
            ('smote', SMOTE(k_neighbors=k_neighbors, random_state=42)),
            ('model', model)
        ])

    try:
        pipeline.fit(X_train, y_train)
    
        # Saving the model after fitting
        joblib.dump(pipeline, 'traffic_severity_predictor.joblib')
        logging.info("Model saved as 'traffic_severity_predictor.joblib'")
    
    except Exception as e:
        logging.error(f"An error occurred during the model training: {e}")
        return None

    return pipeline

def evaluate_model(pipeline, X_test, y_test):
    """
    Evaluate the trained machine learning model using appropriate metrics for imbalanced classes.
    """
    predictions = pipeline.predict(X_test)
    logging.info("\n" + classification_report(y_test, predictions))
    logging.info("Confusion Matrix: \n%s", confusion_matrix(y_test, predictions))
    ##
    logging.info("ROC AUC Score: %f", roc_auc_score(y_test, pipeline.predict_proba(X_test), multi_class='ovo'))


def save_model(pipeline, filename):
    """
    Save the trained model to a file.
    """
    joblib.dump(pipeline, filename)

def main():
    logging.info("Main execution started.")
    
    # Load data
    df = load_data_from_bigquery()
    logging.info("Data loaded from BigQuery.")

    if df.empty or not isinstance(df, pd.DataFrame):
        logging.error("No data loaded from BigQuery, or 'df' is not a pandas DataFrame.")
        return 
    
    # Separate target from features
    y = df['Severity']
    X = df.drop('Severity', axis=1)

    preprocessor = preprocess_data(X)

    # Split the dataset into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    pipeline = train_model(X_train, y_train, preprocessor)

    if pipeline:
        # Evaluate the model
        evaluate_model(pipeline, X_test, y_test)

        # Save the model to a file
        save_model(pipeline, 'traffic_severity_predictor.joblib')
    else:
        logging.error("Model training was unsuccessful.")

    logging.info("Main execution finished.")

if __name__ == "__main__":
    main()
