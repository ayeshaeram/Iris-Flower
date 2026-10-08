# Iris Flower Classification - Modern ML Dashboard

A responsive machine learning dashboard for classifying Iris flower species (*Iris setosa*, *Iris versicolor*, and *Iris virginica*) based on sepal and petal dimensions.

## Project Structure

```text
├── app.py                   # Flask REST API & static file web server
├── train.py                 # scikit-learn training script (evaluates 4 models, saves best_model.joblib)
├── requirements.txt         # Python dependencies
├── best_model.joblib        # Serialized trained scikit-learn model
├── model_metadata.json      # Comparison metrics, confusion matrix & dataset metadata
├── package.json             # Frontend Node.js dependencies & scripts
├── vite.config.ts           # Vite build configuration
├── index.html               # Main HTML entry point
├── src/
│   ├── main.tsx             # Application bootstrap
│   ├── App.tsx              # Main dashboard with fixed left sidebar & sections
│   ├── index.css            # Styles, CSS keyframes & reduced-motion rules
│   ├── assets/images/       # High-definition botanical flower images (Setosa, Versicolor, Virginica)
│   ├── data/
│   │   └── irisDataset.ts   # Canonical 150 Iris samples & metrics
│   └── components/
│       ├── PredictSection.tsx       # Inference form, animated flower photo & result card
│       ├── BatchAnalyticsSection.tsx# CSV & Excel upload, bulk predictions & distribution stats
│       ├── PerformanceSection.tsx   # Metric cards, confusion matrix & model comparison bar chart
│       ├── VisualizationSection.tsx # Interactive scatter plot with user's point highlighted
│       ├── AboutSection.tsx         # UCI dataset background & feature guide
│       ├── ReportModal.tsx          # Downloadable HTML/PDF, CSV, and JSON technical reports
│       └── LocalSetupModal.tsx      # Instructions and code viewer for running with Python/Flask
```

## Running the Application Locally

### Option 1: Python Flask Backend + Frontend

1. **Clone or navigate to the project directory:**
   ```bash
   cd iris-classification
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the models:**
   ```bash
   python train.py
   ```
   This will train KNN, Decision Tree, SVM, and Logistic Regression on an 80/20 stratified split and output `best_model.joblib` and `model_metadata.json`.

5. **Run the Flask server:**
   ```bash
   python app.py
   ```
   The Flask server starts at `http://127.0.0.1:5000`.

### Option 2: Frontend Development with Vite

1. **Install Node dependencies:**
   ```bash
   npm install
   ```

2. **Start the local dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## API Endpoints

- `GET /api/health` - Service status
- `GET /api/models` - Comparison metrics for KNN, Decision Tree, SVM, and Logistic Regression
- `POST /api/predict` - Perform inference:
  ```json
  {
    "sepal_length": 5.1,
    "sepal_width": 3.5,
    "petal_length": 1.4,
    "petal_width": 0.2
  }
  ```
  Response:
  ```json
  {
    "species": "Iris setosa",
    "species_short": "setosa",
    "confidence": 99.8,
    "probabilities": {
      "Iris setosa": 99.8,
      "Iris versicolor": 0.2,
      "Iris virginica": 0.0
    }
  }
  ```
