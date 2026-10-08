import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertTriangle,
  BarChart2,
  Filter,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  Flower2
} from 'lucide-react';
import { classifyIrisClient, SPECIES_DETAILS } from '../data/irisDataset';

// Register Chart.js Doughnut controller
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export interface BatchItem {
  id: number;
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
  predictedSpecies: 'Iris setosa' | 'Iris versicolor' | 'Iris virginica';
  confidence: number;
  isValid: boolean;
  errorMessage?: string;
}

interface BatchAnalyticsSectionProps {
  onPlotBatchToViz?: (items: BatchItem[]) => void;
  onOpenReportModal: () => void;
}

export const BatchAnalyticsSection: React.FC<BatchAnalyticsSectionProps> = ({
  onPlotBatchToViz,
  onOpenReportModal
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Pre-seed with a realistic demonstration batch if none uploaded
  useEffect(() => {
    if (batchItems.length === 0) {
      loadDemoData();
    }
  }, []);

  const loadDemoData = () => {
    const demoRows = [
      { sl: 5.1, sw: 3.5, pl: 1.4, pw: 0.2 },
      { sl: 4.9, sw: 3.0, pl: 1.4, pw: 0.2 },
      { sl: 4.7, sw: 3.2, pl: 1.3, pw: 0.2 },
      { sl: 5.0, sw: 3.6, pl: 1.4, pw: 0.2 },
      { sl: 7.0, sw: 3.2, pl: 4.7, pw: 1.4 },
      { sl: 6.4, sw: 3.2, pl: 4.5, pw: 1.5 },
      { sl: 6.9, sw: 3.1, pl: 4.9, pw: 1.5 },
      { sl: 5.5, sw: 2.3, pl: 4.0, pw: 1.3 },
      { sl: 6.3, sw: 3.3, pl: 6.0, pw: 2.5 },
      { sl: 5.8, sw: 2.7, pl: 5.1, pw: 1.9 },
      { sl: 7.1, sw: 3.0, pl: 5.9, pw: 2.1 },
      { sl: 6.5, sw: 3.0, pl: 5.8, pw: 2.2 },
      { sl: 5.4, sw: 3.9, pl: 1.7, pw: 0.4 },
      { sl: 6.0, sw: 2.7, pl: 5.1, pw: 1.6 },
      { sl: 7.7, sw: 3.8, pl: 6.7, pw: 2.2 }
    ];

    processParsedData(demoRows, 'sample_iris_batch.csv');
  };

  const processParsedData = (rows: any[], sourceName: string) => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const processed: BatchItem[] = [];

      rows.forEach((row, idx) => {
        // Resolve common column naming patterns
        const sl = parseFloat(
          row.sepal_length ?? row['Sepal.Length'] ?? row.sepalLength ?? row.SepalLength ?? row.sl ?? row['sepal length'] ?? row[0]
        );
        const sw = parseFloat(
          row.sepal_width ?? row['Sepal.Width'] ?? row.sepalWidth ?? row.SepalWidth ?? row.sw ?? row['sepal width'] ?? row[1]
        );
        const pl = parseFloat(
          row.petal_length ?? row['Petal.Length'] ?? row.petalLength ?? row.PetalLength ?? row.pl ?? row['petal length'] ?? row[2]
        );
        const pw = parseFloat(
          row.petal_width ?? row['Petal.Width'] ?? row.petalWidth ?? row.PetalWidth ?? row.pw ?? row['petal width'] ?? row[3]
        );

        if (isNaN(sl) || isNaN(sw) || isNaN(pl) || isNaN(pw)) {
          processed.push({
            id: idx + 1,
            sepalLength: isNaN(sl) ? 0 : sl,
            sepalWidth: isNaN(sw) ? 0 : sw,
            petalLength: isNaN(pl) ? 0 : pl,
            petalWidth: isNaN(pw) ? 0 : pw,
            predictedSpecies: 'Iris setosa',
            confidence: 0,
            isValid: false,
            errorMessage: 'Non-numeric or missing column values'
          });
          return;
        }

        const pred = classifyIrisClient(sl, sw, pl, pw);

        processed.push({
          id: idx + 1,
          sepalLength: sl,
          sepalWidth: sw,
          petalLength: pl,
          petalWidth: pw,
          predictedSpecies: pred.species,
          confidence: pred.confidence,
          isValid: true
        });
      });

      if (processed.length === 0) {
        throw new Error('No valid tabular rows detected in file.');
      }

      setBatchItems(processed);
      setFileName(sourceName);
      setCurrentPage(1);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse file. Please verify CSV/Excel format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          processParsedData(results.data, file.name);
        },
        error: (err) => {
          setErrorMsg(`CSV parsing error: ${err.message}`);
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          processParsedData(json, file.name);
        } catch (err: any) {
          setErrorMsg(`Excel reading error: ${err.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setErrorMsg('Unsupported file type. Please upload a .csv, .xlsx, or .xls file.');
    }
  };

  // Distribution counts
  const validItems = batchItems.filter(i => i.isValid);
  const countSetosa = validItems.filter(i => i.predictedSpecies === 'Iris setosa').length;
  const countVersicolor = validItems.filter(i => i.predictedSpecies === 'Iris versicolor').length;
  const countVirginica = validItems.filter(i => i.predictedSpecies === 'Iris virginica').length;
  const totalValid = validItems.length;

  const avgConfidence = totalValid > 0
    ? (validItems.reduce((acc, curr) => acc + curr.confidence, 0) / totalValid).toFixed(1)
    : '0';

  const avgPetalLength = totalValid > 0
    ? (validItems.reduce((acc, curr) => acc + curr.petalLength, 0) / totalValid).toFixed(2)
    : '0';

  // Render Chart.js Doughnut for species breakdown
  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Iris setosa', 'Iris versicolor', 'Iris virginica'],
        datasets: [
          {
            data: [countSetosa, countVersicolor, countVirginica],
            backgroundColor: ['#22C55E', '#F59E0B', '#6366F1'],
            borderColor: '#FFFFFF',
            borderWidth: 2,
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeInOutQuad'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              font: { family: 'Inter', size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: 'Inter', size: 12 },
            callbacks: {
              label: (context) => {
                const val = context.parsed;
                const pct = totalValid > 0 ? ((val / totalValid) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${val} specimens (${pct}%)`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [countSetosa, countVersicolor, countVirginica, totalValid]);

  // Download Sample CSV template
  const handleDownloadSampleTemplate = (format: 'csv' | 'xlsx') => {
    const templateData = [
      { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 },
      { sepal_length: 5.9, sepal_width: 3.0, petal_length: 4.2, petal_width: 1.3 },
      { sepal_length: 6.7, sepal_width: 3.1, petal_length: 5.6, petal_width: 2.1 },
      { sepal_length: 4.8, sepal_width: 3.4, petal_length: 1.6, petal_width: 0.2 },
      { sepal_length: 6.3, sepal_width: 2.5, petal_length: 4.9, petal_width: 1.5 },
      { sepal_length: 7.2, sepal_width: 3.6, petal_length: 6.1, petal_width: 2.5 }
    ];

    if (format === 'csv') {
      const csvStr = "sepal_length,sepal_width,petal_length,petal_width\n" +
        templateData.map(r => `${r.sepal_length},${r.sepal_width},${r.petal_length},${r.petal_width}`).join("\n");
      const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'iris_upload_template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "IrisData");
      XLSX.writeFile(wb, "iris_upload_template.xlsx");
    }
  };

  // Export processed batch to CSV
  const handleExportResultsCSV = () => {
    const exportRows = batchItems.map(item => ({
      Row_ID: item.id,
      Sepal_Length_cm: item.sepalLength,
      Sepal_Width_cm: item.sepalWidth,
      Petal_Length_cm: item.petalLength,
      Petal_Width_cm: item.petalWidth,
      Predicted_Species: item.predictedSpecies,
      Confidence_Pct: `${item.confidence}%`,
      Valid: item.isValid ? 'Yes' : 'No'
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Predictions");
    XLSX.writeFile(wb, `iris_batch_predictions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Filtered list
  const filteredItems = batchItems.filter(item => {
    const matchesSpecies = speciesFilter === 'all' || item.predictedSpecies === speciesFilter;
    const matchesSearch = searchFilter === '' ||
      item.id.toString().includes(searchFilter) ||
      item.predictedSpecies.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Batch CSV & Excel Analytics
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Multi-File Ingestion
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Upload spreadsheets (.csv or .xlsx) to execute automated bulk taxonomy classification and generate distribution analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadSampleTemplate('csv')}
              className="text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 btn-pressable cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Sample CSV
            </button>
            <button
              type="button"
              onClick={() => handleDownloadSampleTemplate('xlsx')}
              className="text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 btn-pressable cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Sample Excel
            </button>
          </div>
        </div>
      </div>

      {/* Upload Dropzone Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up stagger-1">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />

          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-xs">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            Click to upload or drag & drop CSV / Excel file
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Supports <strong className="text-slate-700">.csv</strong>, <strong className="text-slate-700">.xlsx</strong>, and <strong className="text-slate-700">.xls</strong> with columns: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">sepal_length</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">sepal_width</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">petal_length</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">petal_width</code>
          </p>

          {fileName && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Loaded: <strong>{fileName}</strong> ({batchItems.length} records)</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Batch Analytics Metrics & Visualizations */}
      {batchItems.length > 0 && (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-2">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Specimens
              </div>
              <div className="mt-2 text-3xl font-black text-slate-900">
                {batchItems.length}
              </div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {totalValid} Valid rows parsed
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Confidence
              </div>
              <div className="mt-2 text-3xl font-black text-indigo-600">
                {avgConfidence}%
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Mean certainty rating
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Petal Length
              </div>
              <div className="mt-2 text-3xl font-black text-slate-900">
                {avgPetalLength} <span className="text-sm font-semibold text-slate-500">cm</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Primary discriminant
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Dominant Species
              </div>
              <div className="mt-2 text-xl font-black text-slate-900 truncate">
                {countSetosa >= countVersicolor && countSetosa >= countVirginica
                  ? 'Iris setosa'
                  : countVersicolor >= countVirginica
                  ? 'Iris versicolor'
                  : 'Iris virginica'}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Highest representation
              </div>
            </div>
          </div>

          {/* Species Distribution Chart & Botanical Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up stagger-3">
            {/* Doughnut Chart */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
                  <h2 className="text-base font-semibold text-slate-900">
                    Species Distribution Breakdown
                  </h2>
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="h-60 w-full relative my-2">
                  <canvas ref={chartRef} />
                </div>
              </div>

              {/* Counts legend badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-xs">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                  <div className="font-bold">{countSetosa}</div>
                  <div className="text-[11px]">Setosa</div>
                </div>
                <div className="p-2 bg-amber-50 text-amber-800 rounded-lg border border-amber-100">
                  <div className="font-bold">{countVersicolor}</div>
                  <div className="text-[11px]">Versicolor</div>
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100">
                  <div className="font-bold">{countVirginica}</div>
                  <div className="text-[11px]">Virginica</div>
                </div>
              </div>
            </div>

            {/* Botanical Flower Gallery with Animation Showcase */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Botanical Bloom Gallery
                    </h2>
                    <p className="text-xs text-slate-500">
                      Species photography with animated floral motion & live counts
                    </p>
                  </div>
                  <Flower2 className="w-5 h-5 text-indigo-600 animate-spin-slow" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(SPECIES_DETAILS).map(([name, details]) => (
                    <div
                      key={name}
                      className="group relative rounded-xl border border-slate-200/80 p-2.5 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 shadow-inner">
                        {details.image ? (
                          <img
                            src={details.image}
                            alt={details.name}
                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 animate-flower-float"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Flower2 className="w-8 h-8 text-slate-300" />
                          </div>
                        )}
                        <span
                          className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white backdrop-blur-xs"
                          style={{ backgroundColor: `${details.color}dd` }}
                        >
                          {details.shortName}
                        </span>
                      </div>

                      <div className="mt-2 text-center">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {details.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {name === 'Iris setosa'
                            ? `${countSetosa} in batch`
                            : name === 'Iris versicolor'
                            ? `${countVersicolor} in batch`
                            : `${countVirginica} in batch`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white btn-pressable cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download Analytics Report</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportResultsCSV}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 btn-pressable cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export Batch Results (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Processed Batch Records Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up stagger-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Batch Inference Records ({batchItems.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Row-by-row prediction results and confidence rankings
                </p>
              </div>

              {/* Search & Filter bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search row ID or class..."
                    value={searchFilter}
                    onChange={(e) => {
                      setSearchFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setSpeciesFilter('all');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      speciesFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpeciesFilter('Iris setosa');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      speciesFilter === 'Iris setosa'
                        ? 'bg-emerald-100 text-emerald-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Setosa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpeciesFilter('Iris versicolor');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      speciesFilter === 'Iris versicolor'
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Versicolor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpeciesFilter('Iris virginica');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      speciesFilter === 'Iris virginica'
                        ? 'bg-indigo-100 text-indigo-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Virginica
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <th className="pb-3 px-3"># Row</th>
                    <th className="pb-3 px-3">Sepal Length</th>
                    <th className="pb-3 px-3">Sepal Width</th>
                    <th className="pb-3 px-3">Petal Length</th>
                    <th className="pb-3 px-3">Petal Width</th>
                    <th className="pb-3 px-3">Predicted Species</th>
                    <th className="pb-3 px-3 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {paginatedItems.map((item) => {
                    const details = SPECIES_DETAILS[item.predictedSpecies];
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-standard">
                        <td className="py-2.5 px-3 text-slate-400 font-sans">{item.id}</td>
                        <td className="py-2.5 px-3 text-slate-800">{item.sepalLength.toFixed(1)} cm</td>
                        <td className="py-2.5 px-3 text-slate-800">{item.sepalWidth.toFixed(1)} cm</td>
                        <td className="py-2.5 px-3 text-slate-800">{item.petalLength.toFixed(1)} cm</td>
                        <td className="py-2.5 px-3 text-slate-800">{item.petalWidth.toFixed(1)} cm</td>
                        <td className="py-2.5 px-3 font-sans">
                          {item.isValid ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                              style={{
                                backgroundColor: `${details.color}15`,
                                borderColor: `${details.color}35`,
                                color: details.color
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: details.color }}
                              />
                              {item.predictedSpecies}
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Invalid
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-sans">
                          {item.isValid ? (
                            <span className="font-semibold text-slate-900">
                              {item.confidence.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-slate-400">--</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500 font-sans">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{' '}
                {filteredItems.length} records
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed btn-pressable cursor-pointer"
                >
                  Previous
                </button>
                <span className="font-semibold text-slate-700">
                  {currentPage} / {totalPages || 1}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed btn-pressable cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
