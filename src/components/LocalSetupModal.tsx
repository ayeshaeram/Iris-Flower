import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Play, FolderTree } from 'lucide-react';

interface LocalSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalSetupModal: React.FC<LocalSetupModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'app' | 'train' | 'requirements'>('instructions');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const requirementsText = `# Python dependencies for Iris Classification Web App
flask>=3.0.2
flask-cors>=4.0.0
scikit-learn>=1.4.1.post1
joblib>=1.3.2
numpy>=1.26.4`;

  const runCommands = `# 1. Clone or navigate to the directory
cd iris-classification

# 2. Set up a Python virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\\Scripts\\activate

# 3. Install required packages
pip install -r requirements.txt

# 4. Train the 4 models & save best model
python train.py

# 5. Run the Flask server
python app.py
# Server runs on http://127.0.0.1:5000`;

  const appPyCode = `import os
import json
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib

app = Flask(__name__, static_folder="dist", static_url_path="")
CORS(app)

FEATURE_LIMITS = {
    "sepal_length": (4.0, 8.5),
    "sepal_width": (1.8, 5.0),
    "petal_length": (0.8, 7.5),
    "petal_width": (0.05, 3.0)
}
SPECIES_NAMES = ["Iris setosa", "Iris versicolor", "Iris virginica"]
model = None

def load_or_train_model():
    global model
    if os.path.exists("best_model.joblib"):
        model = joblib.load("best_model.joblib")
    else:
        from train import train_and_evaluate
        train_and_evaluate()
        model = joblib.load("best_model.joblib")

@app.route("/api/predict", methods=["POST"])
def predict():
    global model
    if model is None:
        load_or_train_model()
    data = request.get_json(silent=True) or {}
    features = [
        float(data["sepal_length"]),
        float(data["sepal_width"]),
        float(data["petal_length"]),
        float(data["petal_width"])
    ]
    input_array = np.array([features])
    pred_idx = int(model.predict(input_array)[0])
    probs = model.predict_proba(input_array)[0] if hasattr(model, "predict_proba") else [1, 0, 0]
    return jsonify({
        "species": SPECIES_NAMES[pred_idx],
        "confidence": round(float(np.max(probs)) * 100, 1),
        "probabilities": {name: round(float(probs[i]) * 100, 2) for i, name in enumerate(SPECIES_NAMES)}
    })

if __name__ == "__main__":
    load_or_train_model()
    app.run(host="0.0.0.0", port=5000)`;

  const trainPyCode = `import json
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
    iris = load_iris()
    X, y = iris.data, iris.target
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    models = {
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "Decision Tree": DecisionTreeClassifier(max_depth=3, random_state=42),
        "SVM": SVC(kernel="rbf", probability=True, random_state=42),
        "Logistic Regression": LogisticRegression(max_iter=200, random_state=42)
    }
    best_model, best_f1 = None, -1.0
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        f1 = f1_score(y_test, y_pred, average="weighted")
        if f1 > best_f1:
            best_f1, best_model = f1, model
    joblib.dump(best_model, "best_model.joblib")
    print(f"Saved champion model to best_model.joblib (F1: {best_f1:.4f})")

if __name__ == "__main__":
    train_and_evaluate()`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Python & Flask Local Setup Instructions
              </h2>
              <p className="text-xs text-slate-500">
                Full code files, requirements, and execution steps to run on your machine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'instructions'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" /> Quickstart Commands
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('train')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'train'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> train.py
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('app')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'app'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> app.py
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'requirements'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> requirements.txt
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-xs">
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono relative">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>Terminal Bash Commands</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(runCommands, 'bash')}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                  >
                    {copiedKey === 'bash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'bash' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-slate-300">{runCommands}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FolderTree className="w-4 h-4 text-indigo-600" /> Project Structure
                  </div>
                  <pre className="text-[11px] font-mono mt-1 text-slate-500 leading-tight">
{`app.py
train.py
requirements.txt
best_model.joblib
src/
dist/`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">Testing the Flask Endpoint</div>
                  <pre className="text-[11px] font-mono mt-1 text-slate-500 leading-tight">
{`curl -X POST http://127.0.0.1:5000/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}'`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'train' && (
            <div className="relative">
              <div className="flex items-center justify-between pb-2 mb-2">
                <span className="font-semibold text-slate-700">train.py (Model Training & Comparison Pipeline)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(trainPyCode, 'train')}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 cursor-pointer"
                >
                  {copiedKey === 'train' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'train' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                {trainPyCode}
              </pre>
            </div>
          )}

          {activeTab === 'app' && (
            <div className="relative">
              <div className="flex items-center justify-between pb-2 mb-2">
                <span className="font-semibold text-slate-700">app.py (Flask REST API Server)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(appPyCode, 'app')}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 cursor-pointer"
                >
                  {copiedKey === 'app' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'app' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                {appPyCode}
              </pre>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="relative">
              <div className="flex items-center justify-between pb-2 mb-2">
                <span className="font-semibold text-slate-700">requirements.txt</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(requirementsText, 'req')}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 cursor-pointer"
                >
                  {copiedKey === 'req' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'req' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                {requirementsText}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl btn-pressable cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
