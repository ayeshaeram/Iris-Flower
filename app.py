"""
Flask REST API for Iris Flower Classification
Provides inference endpoints and model comparison data.
"""

import os
import json
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib

app = Flask(__name__, static_folder="dist", static_url_path="")
CORS(app)  # Enable Cross-Origin Resource Sharing for API calls

# Feature validation boundaries (in cm)
FEATURE_LIMITS = {
    "sepal_length": (4.0, 8.5),
    "sepal_width": (1.8, 5.0),
    "petal_length": (0.8, 7.5),
    "petal_width": (0.05, 3.0)
}

SPECIES_NAMES = ["Iris setosa", "Iris versicolor", "Iris virginica"]

# Global model cache
model = None

def load_or_train_model():
    """Load pre-trained model or trigger training if missing."""
    global model
    if os.path.exists("best_model.joblib"):
        try:
            model = joblib.load("best_model.joblib")
            return
        except Exception as e:
            print(f"Error loading model: {e}")
    # Fallback: train on the fly
    from train import train_and_evaluate
    train_and_evaluate()
    model = joblib.load("best_model.joblib")

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "iris-classification-api"})

@app.route("/api/models", methods=["GET"])
def get_models():
    """Return performance metrics of all 4 models."""
    if not os.path.exists("model_metadata.json"):
        from train import train_and_evaluate
        train_and_evaluate()
    with open("model_metadata.json", "r") as f:
        data = json.load(f)
    return jsonify(data)

@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Predict Iris species from botanical measurements.
    Expects JSON: { sepal_length: float, sepal_width: float, petal_length: float, petal_width: float }
    """
    global model
    if model is None:
        load_or_train_model()

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body provided."}), 400

    # Validate inputs
    features = []
    errors = []
    keys = ["sepal_length", "sepal_width", "petal_length", "petal_width"]

    for k in keys:
        if k not in data:
            errors.append(f"Missing required parameter: {k}")
            continue
        try:
            val = float(data[k])
            min_v, max_v = FEATURE_LIMITS[k]
            if val < min_v or val > max_v:
                errors.append(f"'{k}' value {val} is outside valid range [{min_v}, {max_v}] cm.")
            features.append(val)
        except (ValueError, TypeError):
            errors.append(f"'{k}' must be a valid numeric floating point number.")

    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 422

    # Inference
    input_array = np.array([features])
    prediction_index = int(model.predict(input_array)[0])

    # Probabilities if supported
    probabilities = {}
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(input_array)[0]
        for idx, species in enumerate(SPECIES_NAMES):
            probabilities[species] = round(float(probs[idx]) * 100, 2)
        confidence = float(np.max(probs) * 100)
    else:
        confidence = 100.0
        probabilities = {s: (100.0 if i == prediction_index else 0.0) for i, s in enumerate(SPECIES_NAMES)}

    predicted_species = SPECIES_NAMES[prediction_index]

    return jsonify({
        "species": predicted_species,
        "species_short": predicted_species.replace("Iris ", ""),
        "confidence": round(confidence, 1),
        "probabilities": probabilities,
        "inputs": {
            "sepal_length": features[0],
            "sepal_width": features[1],
            "petal_length": features[2],
            "petal_width": features[3]
        }
    })

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    """Serve frontend production build."""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    load_or_train_model()
    # Runs on port 5000 or PORT env var
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
