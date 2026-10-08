"""
Model Training & Evaluation Script for Iris Classification
Trains 4 scikit-learn models (KNN, Decision Tree, SVM, Logistic Regression)
on the Iris dataset with an 80/20 train-test split, evaluates metrics,
and serializes the best performing model using joblib.
"""

import json
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib

def train_and_evaluate():
    # 1. Load the Fisher's Iris dataset
    iris = load_iris()
    X = iris.data  # shape: (150, 4) -> sepal_length, sepal_width, petal_length, petal_width
    y = iris.target  # shape: (150,) -> 0: setosa, 1: versicolor, 2: virginica
    feature_names = iris.feature_names
    target_names = list(iris.target_names)

    # 2. Split dataset: 80% training (120 samples) and 20% testing (30 samples)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # 3. Define the 4 candidate models
    models = {
        "K-Nearest Neighbors (KNN)": KNeighborsClassifier(n_neighbors=5),
        "Decision Tree": DecisionTreeClassifier(max_depth=3, random_state=42),
        "Support Vector Machine (SVM)": SVC(kernel="rbf", probability=True, random_state=42),
        "Logistic Regression": LogisticRegression(max_iter=200, random_state=42)
    }

    results = {}
    best_model_name = None
    best_score = -1.0
    best_model_obj = None

    # 4. Train each model and calculate comprehensive metrics
    for name, model in models.items():
        # Fit on training partition
        model.fit(X_train, y_train)

        # Predict on holdout test partition
        y_pred = model.predict(X_test)

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average="weighted"))
        rec = float(recall_score(y_test, y_pred, average="weighted"))
        f1 = float(f1_score(y_test, y_pred, average="weighted"))
        cm = confusion_matrix(y_test, y_pred).tolist()

        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm
        }

        # Select best model prioritizing accuracy and F1-score
        if f1 > best_score:
            best_score = f1
            best_model_name = name
            best_model_obj = model

    # 5. Persist the champion model with joblib
    joblib.dump(best_model_obj, "best_model.joblib")
    print(f"Saved best model '{best_model_name}' (F1: {best_score:.4f}) to best_model.joblib")

    # 6. Save metadata for downstream services
    manifest = {
        "best_model": best_model_name,
        "feature_names": feature_names,
        "target_names": target_names,
        "split": {"train_count": len(X_train), "test_count": len(X_test), "ratio": "80/20"},
        "models": results
    }

    with open("model_metadata.json", "w") as f:
        json.dump(manifest, f, indent=2)

    return manifest

if __name__ == "__main__":
    train_and_evaluate()
