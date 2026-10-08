import React, { useEffect, useRef, useState } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Award,
  CheckCircle,
  HelpCircle,
  Sliders,
  Cpu
} from 'lucide-react';
import { MODEL_METRICS, CONFUSION_MATRIX } from '../data/irisDataset';

// Register necessary Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const PerformanceSection: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Selected metric to compare across the 4 models
  const [metricTab, setMetricTab] = useState<'all' | 'accuracy' | 'f1Score'>('all');
  const [selectedModel, setSelectedModel] = useState<string>('Support Vector Machine (SVM)');

  // Best model reference
  const bestModel = MODEL_METRICS.find(m => m.isBest) || MODEL_METRICS[0];

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = MODEL_METRICS.map(m => m.shortName);

    // Build datasets depending on selected filter tab
    let datasets = [];

    if (metricTab === 'all') {
      datasets = [
        {
          label: 'Accuracy (%)',
          data: MODEL_METRICS.map(m => m.accuracy),
          backgroundColor: '#6366F1', // Indigo
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Precision (%)',
          data: MODEL_METRICS.map(m => m.precision),
          backgroundColor: '#0EA5E9', // Sky blue
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Recall (%)',
          data: MODEL_METRICS.map(m => m.recall),
          backgroundColor: '#10B981', // Emerald
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'F1-Score (%)',
          data: MODEL_METRICS.map(m => m.f1Score),
          backgroundColor: '#8B5CF6', // Purple
          borderRadius: 6,
          borderSkipped: false
        }
      ];
    } else if (metricTab === 'accuracy') {
      datasets = [
        {
          label: 'Accuracy (%)',
          data: MODEL_METRICS.map(m => m.accuracy),
          backgroundColor: MODEL_METRICS.map(m => m.isBest ? '#6366F1' : '#94A3B8'),
          borderRadius: 6,
          borderSkipped: false
        }
      ];
    } else {
      datasets = [
        {
          label: 'F1-Score (%)',
          data: MODEL_METRICS.map(m => m.f1Score),
          backgroundColor: MODEL_METRICS.map(m => m.isBest ? '#6366F1' : '#94A3B8'),
          borderRadius: 6,
          borderSkipped: false
        }
      ];
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeInOutQuad'
        },
        scales: {
          y: {
            min: 88,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
              stepSize: 2,
              font: { family: 'Inter', size: 11 }
            },
            grid: {
              color: '#F1F5F9'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { family: 'Inter', size: 11, weight: 500 }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: 'Inter', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleFont: { family: 'Inter', size: 12, weight: 'bold' },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.raw}%`
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [metricTab]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Model Evaluation & Performance
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Best Model: {bestModel.shortName}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Comparison across 4 scikit-learn classifiers evaluated on an 80/20 train-test split (120 training / 30 holdout testing samples, random_state=42).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80 text-slate-600">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Persisted as <strong className="text-slate-800">best_model.joblib</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Accuracy
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
            {bestModel.accuracy}%
          </div>
          <div className="mt-1 text-xs text-slate-600 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">29/30</span> test samples correct
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Precision (Weighted)
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
            {bestModel.precision}%
          </div>
          <div className="mt-1 text-xs text-slate-600">
            High true positive purity
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Recall (Weighted)
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
            {bestModel.recall}%
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Minimal false negatives
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            F1-Score (Weighted)
          </div>
          <div className="mt-2 text-3xl font-black text-indigo-600 tracking-tight">
            {bestModel.f1Score}%
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Harmonic balance of precision/recall
          </div>
        </div>
      </div>

      {/* Charts Grid: Models Comparison Bar Chart + Confusion Matrix Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Model Comparison Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up stagger-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Four Models Benchmark
                </h2>
                <p className="text-xs text-slate-600">
                  Comparing KNN, Decision Tree, SVM, and Logistic Regression
                </p>
              </div>

              {/* Chart tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMetricTab('all')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-standard cursor-pointer ${
                    metricTab === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Metrics
                </button>
                <button
                  type="button"
                  onClick={() => setMetricTab('accuracy')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-standard cursor-pointer ${
                    metricTab === 'accuracy'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Accuracy
                </button>
                <button
                  type="button"
                  onClick={() => setMetricTab('f1Score')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-standard cursor-pointer ${
                    metricTab === 'f1Score'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  F1-Score
                </button>
              </div>
            </div>

            <div className="h-72 w-full">
              <canvas ref={chartRef} />
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              SVM, KNN, and Logistic Regression achieved peak 96.67% accuracy.
            </span>
            <span className="font-mono text-slate-600">Test N=30</span>
          </div>
        </div>

        {/* Confusion Matrix Heatmap */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up stagger-3 flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">
                Confusion Matrix Heatmap
              </h2>
              <p className="text-xs text-slate-600">
                Actual vs. Predicted class counts on the test set
              </p>
            </div>

            {/* Matrix Visualizer */}
            <div className="space-y-3">
              {/* Column labels (Predicted) */}
              <div className="text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Predicted Species →
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-medium">
                {/* Empty corner */}
                <div className="p-2 text-slate-600 text-[11px] font-semibold flex items-center justify-center">
                  Actual ↓
                </div>
                {CONFUSION_MATRIX.labels.map(label => (
                  <div key={label} className="p-2 text-slate-700 font-semibold bg-slate-50 rounded-lg">
                    {label}
                  </div>
                ))}

                {/* Rows for Actual Classes */}
                {CONFUSION_MATRIX.matrix.map((row, actualIdx) => (
                  <React.Fragment key={actualIdx}>
                    {/* Row Header */}
                    <div className="p-2 text-slate-700 font-semibold bg-slate-50 rounded-lg flex items-center justify-center">
                      {CONFUSION_MATRIX.labels[actualIdx]}
                    </div>

                    {/* Cells */}
                    {row.map((count, predIdx) => {
                      const isCorrect = actualIdx === predIdx;
                      let bgClass = 'bg-slate-50 text-slate-400 border border-slate-100';
                      if (isCorrect && count === 10) {
                        bgClass = 'bg-indigo-600 text-white font-bold shadow-xs';
                      } else if (isCorrect && count > 0) {
                        bgClass = 'bg-indigo-500 text-white font-bold shadow-xs';
                      } else if (count > 0) {
                        bgClass = 'bg-rose-100 text-rose-800 font-bold border border-rose-200';
                      }

                      return (
                        <div
                          key={predIdx}
                          className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${bgClass}`}
                          title={`Actual: ${CONFUSION_MATRIX.labels[actualIdx]}, Predicted: ${CONFUSION_MATRIX.labels[predIdx]}: ${count} samples`}
                        >
                          <span className="text-base font-black">{count}</span>
                          <span className="text-[10px] opacity-80">
                            {isCorrect ? 'Correct' : count > 0 ? 'Error' : '-'}
                          </span>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Per-Class breakdown list */}
            <div className="mt-5 space-y-2 pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700">Class Performance Summary:</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                  <div className="font-semibold">Setosa</div>
                  <div className="text-[11px] opacity-90">100% Rec / 100% Prec</div>
                </div>
                <div className="p-2 bg-amber-50 text-amber-800 rounded-lg border border-amber-100">
                  <div className="font-semibold">Versicolor</div>
                  <div className="text-[11px] opacity-90">90% Rec / 100% Prec</div>
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100">
                  <div className="font-semibold">Virginica</div>
                  <div className="text-[11px] opacity-90">100% Rec / 91% Prec</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Architecture & Hyperparameters Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up stagger-4">
        <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Model Hyperparameters & Architecture
            </h2>
            <p className="text-xs text-slate-600">
              Complete specifications of the 4 evaluated scikit-learn models
            </p>
          </div>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            Configured in <code className="text-slate-800 font-mono">train.py</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <th className="pb-3 px-3">Algorithm</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Parameters</th>
                <th className="pb-3 px-3 text-right">Accuracy</th>
                <th className="pb-3 px-3 text-right">F1-Score</th>
                <th className="pb-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MODEL_METRICS.map((model) => (
                <tr
                  key={model.name}
                  onClick={() => setSelectedModel(model.name)}
                  className={`hover:bg-slate-50/80 transition-standard cursor-pointer ${
                    selectedModel === model.name ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    {model.name}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">{model.algorithmType}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 text-[11px]">
                    {model.parameters}
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-slate-800">
                    {model.accuracy}%
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-indigo-600">
                    {model.f1Score}%
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {model.isBest ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <Award className="w-3 h-3" /> Selected
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-600 font-medium">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
