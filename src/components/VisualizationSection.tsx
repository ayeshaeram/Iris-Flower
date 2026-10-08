import React, { useEffect, useRef, useState } from 'react';
import {
  Chart,
  ScatterController,
  PointElement,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Target, Layers, Info } from 'lucide-react';
import { IRIS_DATA, SPECIES_DETAILS } from '../data/irisDataset';

// Register Chart.js components for scatter plots
Chart.register(ScatterController, PointElement, LinearScale, Tooltip, Legend);

interface VisualizationSectionProps {
  userPoint: {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: string;
  } | null;
}

type FeatureKey = 'sepalLength' | 'sepalWidth' | 'petalLength' | 'petalWidth';

interface AxisOption {
  key: FeatureKey;
  label: string;
  unit: string;
}

const FEATURE_OPTIONS: AxisOption[] = [
  { key: 'petalLength', label: 'Petal Length', unit: 'cm' },
  { key: 'petalWidth', label: 'Petal Width', unit: 'cm' },
  { key: 'sepalLength', label: 'Sepal Length', unit: 'cm' },
  { key: 'sepalWidth', label: 'Sepal Width', unit: 'cm' }
];

export const VisualizationSection: React.FC<VisualizationSectionProps> = ({ userPoint }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Selected axes
  const [xAxis, setXAxis] = useState<FeatureKey>('petalLength');
  const [yAxis, setYAxis] = useState<FeatureKey>('petalWidth');

  // Species visibility filter
  const [activeSpeciesFilter, setActiveSpeciesFilter] = useState<string>('all');

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Filter points by species
    const setosaPoints = IRIS_DATA
      .filter(d => d.species === 'Iris setosa')
      .map(d => ({ x: d[xAxis], y: d[yAxis] }));

    const versicolorPoints = IRIS_DATA
      .filter(d => d.species === 'Iris versicolor')
      .map(d => ({ x: d[xAxis], y: d[yAxis] }));

    const virginicaPoints = IRIS_DATA
      .filter(d => d.species === 'Iris virginica')
      .map(d => ({ x: d[xAxis], y: d[yAxis] }));

    const datasets: any[] = [];

    if (activeSpeciesFilter === 'all' || activeSpeciesFilter === 'Iris setosa') {
      datasets.push({
        label: 'Iris setosa',
        data: setosaPoints,
        backgroundColor: '#22C55E', // Green
        borderColor: '#16A34A',
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7
      });
    }

    if (activeSpeciesFilter === 'all' || activeSpeciesFilter === 'Iris versicolor') {
      datasets.push({
        label: 'Iris versicolor',
        data: versicolorPoints,
        backgroundColor: '#F59E0B', // Amber
        borderColor: '#D97706',
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7
      });
    }

    if (activeSpeciesFilter === 'all' || activeSpeciesFilter === 'Iris virginica') {
      datasets.push({
        label: 'Iris virginica',
        data: virginicaPoints,
        backgroundColor: '#6366F1', // Indigo
        borderColor: '#4F46E5',
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7
      });
    }

    // Add user's highlighted input point if available
    if (userPoint) {
      datasets.push({
        label: `Your Input Point (${userPoint.species})`,
        data: [{ x: userPoint[xAxis], y: userPoint[yAxis] }],
        backgroundColor: '#EC4899', // Pink highlight
        borderColor: '#0F172A',
        borderWidth: 2.5,
        pointRadius: 10,
        pointHoverRadius: 13,
        pointStyle: 'triangle',
        order: -1 // Draw on top
      });
    }

    const xOption = FEATURE_OPTIONS.find(f => f.key === xAxis)!;
    const yOption = FEATURE_OPTIONS.find(f => f.key === yAxis)!;

    chartInstance.current = new Chart(ctx, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeInOutQuad'
        },
        scales: {
          x: {
            title: {
              display: true,
              text: `${xOption.label} (${xOption.unit})`,
              font: { family: 'Inter', size: 12, weight: 600 },
              color: '#475569'
            },
            grid: {
              color: '#F1F5F9'
            },
            ticks: {
              font: { family: 'Inter', size: 11 }
            }
          },
          y: {
            title: {
              display: true,
              text: `${yOption.label} (${yOption.unit})`,
              font: { family: 'Inter', size: 12, weight: 600 },
              color: '#475569'
            },
            grid: {
              color: '#F1F5F9'
            },
            ticks: {
              font: { family: 'Inter', size: 11 }
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
              font: { family: 'Inter', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: 'Inter', size: 12, weight: 'bold' },
            bodyFont: { family: 'Inter', size: 12 },
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                return ` ${label}: (${context.parsed.x} cm, ${context.parsed.y} cm)`;
              }
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
  }, [xAxis, yAxis, activeSpeciesFilter, userPoint]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Feature Space Scatter Plot
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Explore 150 biological specimens across 2D dimensional projections. Inspect decision boundaries and your active input point.
            </p>
          </div>

          {/* Quick preset coordinate pairs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Quick views:</span>
            <button
              type="button"
              onClick={() => {
                setXAxis('petalLength');
                setYAxis('petalWidth');
              }}
              className={`text-xs px-2.5 py-1.5 rounded-lg border btn-pressable cursor-pointer ${
                xAxis === 'petalLength' && yAxis === 'petalWidth'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Petal L vs W (Standard)
            </button>
            <button
              type="button"
              onClick={() => {
                setXAxis('sepalLength');
                setYAxis('sepalWidth');
              }}
              className={`text-xs px-2.5 py-1.5 rounded-lg border btn-pressable cursor-pointer ${
                xAxis === 'sepalLength' && yAxis === 'sepalWidth'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sepal L vs W
            </button>
          </div>
        </div>
      </div>

      {/* Main Scatter Visualizer Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up stagger-1">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* X-axis dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>X-Axis:</span>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value as FeatureKey)}
                aria-label="X-Axis feature"
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {FEATURE_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Y-axis dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>Y-Axis:</span>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value as FeatureKey)}
                aria-label="Y-Axis feature"
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {FEATURE_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter species */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-600 font-medium hidden sm:inline">Filter:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveSpeciesFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeSpeciesFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All (150)
              </button>
              <button
                type="button"
                onClick={() => setActiveSpeciesFilter('Iris setosa')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeSpeciesFilter === 'Iris setosa'
                    ? 'bg-emerald-100 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Setosa
              </button>
              <button
                type="button"
                onClick={() => setActiveSpeciesFilter('Iris versicolor')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeSpeciesFilter === 'Iris versicolor'
                    ? 'bg-amber-100 text-amber-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Versicolor
              </button>
              <button
                type="button"
                onClick={() => setActiveSpeciesFilter('Iris virginica')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeSpeciesFilter === 'Iris virginica'
                    ? 'bg-indigo-100 text-indigo-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Virginica
              </button>
            </div>
          </div>
        </div>

        {/* User point highlight badge if active */}
        {userPoint && (
          <div className="mb-4 p-3 bg-pink-50/70 rounded-xl border border-pink-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 bg-pink-500 rounded-full animate-pulse-glow" />
              <div className="text-xs">
                <span className="font-semibold text-slate-900">Your Active Prediction Point: </span>
                <span className="text-slate-700 font-medium">{userPoint.species}</span>
                <span className="text-slate-500 font-mono ml-2">
                  [{FEATURE_OPTIONS.find(f => f.key === xAxis)?.label}: {userPoint[xAxis]} cm, {FEATURE_OPTIONS.find(f => f.key === yAxis)?.label}: {userPoint[yAxis]} cm]
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-pink-700 uppercase tracking-wide">
              ▲ Pink Marker
            </span>
          </div>
        )}

        {/* Canvas chart */}
        <div className="h-96 w-full relative">
          <canvas ref={chartRef} />
        </div>
      </div>

      {/* Botanical Clustering Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up stagger-2">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900">Iris setosa Cluster</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Completely linearly separable from other species due to ultra-short petals (length &lt; 2.0 cm, width &lt; 0.6 cm). Classifiers achieve 100% recall effortlessly.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">Iris versicolor Cluster</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mid-sized flower morphology with petal lengths between 3.0 and 5.1 cm. Shares a subtle transition boundary with virginica near petal width 1.5–1.8 cm.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900">Iris virginica Cluster</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consistently occupies the upper right quadrant of the feature space with robust petal lengths (up to 6.9 cm) and petal widths up to 2.5 cm.
          </p>
        </div>
      </div>
    </div>
  );
};
