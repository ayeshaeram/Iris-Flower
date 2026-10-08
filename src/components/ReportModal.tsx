import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  CheckCircle2,
  Award,
  Flower2
} from 'lucide-react';
import { MODEL_METRICS, CONFUSION_MATRIX, SPECIES_DETAILS, IRIS_DATA } from '../data/irisDataset';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastPrediction: {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: string;
    confidence: number;
  } | null;
  batchData?: {
    total: number;
    speciesCounts: { [key: string]: number };
  } | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  lastPrediction,
  batchData
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const bestModel = MODEL_METRICS.find(m => m.isBest) || MODEL_METRICS[0];

  const handlePrintOrSaveHTML = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Iris Classification Technical Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
            h1 { font-size: 24px; color: #0f172a; margin-bottom: 4px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
            .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
            .card-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
            .card-val { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
            th { background: #f1f5f9; color: #334155; }
            .highlight { background: #eff6ff; font-weight: bold; }
            .species-pill { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
            .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 11px; color: #94a3b8; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>Iris Classification & ML Model Benchmark Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleDateString()} • Stratified 80/20 Train-Test Split (${CONFUSION_MATRIX.matrix.flat().reduce((a, b) => a + b, 0)} Test Samples)</div>

          <div class="grid">
            <div class="card">
              <div class="card-title">Champion Accuracy</div>
              <div class="card-val">${bestModel.accuracy}%</div>
            </div>
            <div class="card">
              <div class="card-title">Precision (Weighted)</div>
              <div class="card-val">${bestModel.precision}%</div>
            </div>
            <div class="card">
              <div class="card-title">Recall (Weighted)</div>
              <div class="card-val">${bestModel.recall}%</div>
            </div>
            <div class="card">
              <div class="card-title">F1-Score</div>
              <div class="card-val" style="color: #6366f1;">${bestModel.f1Score}%</div>
            </div>
          </div>

          ${lastPrediction ? `
            <div class="card" style="margin-bottom: 24px; border-left: 4px solid #6366f1;">
              <div class="card-title">Recent Inference Specimen</div>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Predicted Species:</strong> ${lastPrediction.species} (${lastPrediction.confidence}% confidence)</p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">Sepal: ${lastPrediction.sepalLength} x ${lastPrediction.sepalWidth} cm | Petal: ${lastPrediction.petalLength} x ${lastPrediction.petalWidth} cm</p>
            </div>
          ` : ''}

          <h3 style="margin-top: 24px;">Model Benchmark Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Architecture</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1-Score</th>
              </tr>
            </thead>
            <tbody>
              ${MODEL_METRICS.map(m => `
                <tr class="${m.isBest ? 'highlight' : ''}">
                  <td><strong>${m.name}</strong> ${m.isBest ? '★ (Best)' : ''}</td>
                  <td>${m.algorithmType}</td>
                  <td>${m.accuracy}%</td>
                  <td>${m.precision}%</td>
                  <td>${m.recall}%</td>
                  <td>${m.f1Score}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3 style="margin-top: 28px;">Confusion Matrix on Holdout Test Set</h3>
          <table>
            <thead>
              <tr>
                <th>Actual \\ Predicted</th>
                <th>Iris setosa</th>
                <th>Iris versicolor</th>
                <th>Iris virginica</th>
              </tr>
            </thead>
            <tbody>
              ${CONFUSION_MATRIX.matrix.map((row, i) => `
                <tr>
                  <td><strong>${CONFUSION_MATRIX.labels[i]}</strong></td>
                  <td>${row[0]}</td>
                  <td>${row[1]}</td>
                  <td>${row[2]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            Iris Flower Classification System • Ronald A. Fisher (1936) • scikit-learn ML Engine
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Printable HTML / PDF Report
              </h2>
              <p className="text-xs text-slate-500">
                Official executive benchmark and classification summary
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Evaluated Model</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {bestModel.accuracy}% Accuracy
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{bestModel.name}</span>
            </div>

            {lastPrediction && (
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Latest Specimen:</span>
                <span className="font-semibold text-slate-800">
                  {lastPrediction.species} ({lastPrediction.confidence}%)
                </span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              <div className="font-bold text-slate-900">Printable HTML & PDF Format</div>
              <p className="mt-0.5 text-slate-500">
                Includes executive KPI cards (Accuracy, Precision, Recall, F1), the 4-model comparison table, confusion matrix, and specimen details. Opens print dialogue to save as PDF or print directly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {downloadSuccess && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Document opened for print / PDF!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePrintOrSaveHTML}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs btn-pressable cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
