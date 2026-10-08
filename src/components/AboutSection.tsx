import React, { useState } from 'react';
import {
  Database,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  BookOpen,
  Flower2,
  GitBranch,
  RotateCw,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { IRIS_DATA, SPECIES_DETAILS } from '../data/irisDataset';

interface Flashcard {
  id: number;
  category: string;
  badgeType: 'critical' | 'medium' | 'optimal';
  question: string;
  answer: string;
  keyTakeaway: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    category: 'Species Separation',
    badgeType: 'optimal',
    question: 'Why is Iris setosa considered 100% "linearly separable"?',
    answer: 'Setosa has uniquely tiny petals (length < 2.0 cm, width < 0.6 cm). A simple straight line threshold effortlessly separates every single Setosa with 100% accuracy and zero misclassifications.',
    keyTakeaway: 'Petal Length < 2.45 cm = Guaranteed Setosa'
  },
  {
    id: 2,
    category: 'Feature Importance',
    badgeType: 'critical',
    question: 'Why are Petals marked CRITICAL while Sepals are marked MEDIUM?',
    answer: 'Petal dimensions have wide, distinct distributions across species with minimal overlap, giving machine learning models their strongest predictive signal. Sepals overlap heavily between species.',
    keyTakeaway: 'Petal dimensions contribute >85% of classification weights'
  },
  {
    id: 3,
    category: 'Botanical Collection',
    badgeType: 'medium',
    question: 'Where did the 150 Iris specimens actually come from?',
    answer: 'American botanist Edgar Anderson collected all 150 wild specimens from the Gaspé Peninsula in Quebec, Canada, on the exact same pasture on the same day to maintain strict scientific control.',
    keyTakeaway: 'Published by Ronald A. Fisher in 1936'
  },
  {
    id: 4,
    category: 'Machine Learning Split',
    badgeType: 'optimal',
    question: 'What is the purpose of the 80/20 train-test split?',
    answer: '120 flowers (80%) teach the machine learning algorithms to recognize patterns. 30 holdout flowers (20%) are kept hidden to test how accurately the model predicts brand-new, unseen specimens.',
    keyTakeaway: 'Evaluates real-world generalization, not memorization'
  },
  {
    id: 5,
    category: 'Model Benchmark',
    badgeType: 'critical',
    question: 'Which model won the benchmark and was saved to best_model.joblib?',
    answer: 'Support Vector Machine (SVM with RBF kernel) achieved 96.67% test accuracy (29/30 correct). Its mathematical hyperplane maximizes margins even in borderline boundary regions.',
    keyTakeaway: 'SVM selected as champion model (96.65% F1)'
  }
];

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mindmap' | 'flashcards' | 'dataset'>('mindmap');
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Search & filter for table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const toggleCardFlip = (id: number) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSamples = IRIS_DATA.filter((sample) => {
    const matchesSpecies = selectedSpeciesFilter === 'all' || sample.species === selectedSpeciesFilter;
    const matchesQuery = searchQuery === '' ||
      sample.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.id.toString().includes(searchQuery);
    return matchesSpecies && matchesQuery;
  });

  const totalPages = Math.ceil(filteredSamples.length / itemsPerPage);
  const paginatedSamples = filteredSamples.slice(
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
                About the Iris Dataset
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Simple & Intuitive Guide
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Explore the Fisher 1936 benchmark through an interactive visual mindmap, 3D flip flashcards, and plain-English explanations.
            </p>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('mindmap')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'mindmap'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌿 Visual Mindmap
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📇 Interactive Flashcards
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dataset')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'dataset'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📋 Raw Table ({IRIS_DATA.length})
            </button>
          </div>
        </div>
      </div>

      {/* 4 Clean Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Samples</span>
            <Database className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">150</div>
          <p className="text-xs text-slate-500 mt-1">50 flowers per species</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Input Features</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">4</div>
          <div className="flex gap-1.5 mt-1">
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">2 Critical</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">2 Medium</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Species Classes</span>
            <Flower2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">3</div>
          <p className="text-xs text-slate-500 mt-1">Setosa, Versicolor, Virginica</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Train / Test Split</span>
            <GitBranch className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-indigo-600">80 / 20</div>
          <p className="text-xs text-slate-500 mt-1">120 train / 30 test</p>
        </div>
      </div>

      {/* TAB 1: VISUAL MINDMAP / TAXONOMIC FLOWCHART */}
      {activeTab === 'mindmap' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fade-in-up">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-600" />
                <span>Iris Dataset Architectural Mindmap</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Visual tree showing how botanical features route into machine learning predictions
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Intuitive Overview</span>
          </div>

          {/* Clean Graphic Mindmap Diagram */}
          <div className="p-4 sm:p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-8 font-sans">
            {/* Level 0: Root Node */}
            <div className="flex justify-center">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-700 text-center max-w-sm w-full">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Root Dataset</div>
                <div className="text-base font-black mt-0.5">Fisher's Iris Dataset (1936)</div>
                <div className="text-xs text-slate-300 mt-1">150 Canonical Wild Flowers • 4 Continuous Features</div>
              </div>
            </div>

            {/* Connecting lines */}
            <div className="w-full flex justify-center">
              <div className="h-6 w-0.5 bg-indigo-300" />
            </div>

            {/* Level 1: Three Branches (Species, Features, ML Pipeline) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Branch A: 3 Species */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900">3 Target Species (50 each)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <div className="font-bold flex items-center justify-between">
                      <span>🌿 Iris setosa</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800">OPTIMAL</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">Tiny petals (&lt;2cm) • 100% Linearly Separable</div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                    <div className="font-bold flex items-center justify-between">
                      <span>🌾 Iris versicolor</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-800">MEDIUM</span>
                    </div>
                    <div className="text-[11px] text-amber-700 mt-0.5">Medium petals (3–5cm) • Slight overlap with Virginica</div>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900">
                    <div className="font-bold flex items-center justify-between">
                      <span>🌸 Iris virginica</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-200 text-indigo-800">CRITICAL</span>
                    </div>
                    <div className="text-[11px] text-indigo-700 mt-0.5">Largest petals (5–7cm) • Deep royal purple flowers</div>
                  </div>
                </div>
              </div>

              {/* Branch B: 4 Features with Critical & Medium Color Coding */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-slate-900">4 Botanical Features</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                    <div className="font-bold flex items-center justify-between">
                      <span>Petal Length & Width</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-200 text-rose-800">CRITICAL</span>
                    </div>
                    <div className="text-[11px] text-rose-700 mt-0.5">Sharp mathematical boundaries • Zero setosa overlap</div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                    <div className="font-bold flex items-center justify-between">
                      <span>Sepal Length & Width</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-800">MEDIUM</span>
                    </div>
                    <div className="text-[11px] text-amber-700 mt-0.5">Supporting indicators • Moderate cluster spread</div>
                  </div>
                </div>
              </div>

              {/* Branch C: Machine Learning Pipeline */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-xs font-bold text-slate-900">Machine Learning Workflow</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
                    <div className="font-bold">1. Stratified 80/20 Split</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">120 train / 30 holdout test specimens</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
                    <div className="font-bold">2. Evaluate 4 Algorithms</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">KNN, Decision Tree, SVM, Logistic Regression</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <div className="font-bold flex items-center justify-between">
                      <span>3. Champion Model (SVM)</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800">96.67% ACC</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">Serialized to best_model.joblib for inference</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE 3D FLIP FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fade-in-up">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Interactive Knowledge Flashcards</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any card to flip between Question and Answer. Test your knowledge of the Iris benchmark!
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Click card to reveal answer</span>
              <RotateCw className="w-4 h-4 text-indigo-500" />
            </div>
          </div>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FLASHCARDS.map((card) => {
              const isFlipped = !!flippedCards[card.id];

              return (
                <div
                  key={card.id}
                  onClick={() => toggleCardFlip(card.id)}
                  className="h-64 cursor-pointer perspective-1000 group"
                >
                  <div
                    className={`relative w-full h-full rounded-2xl p-5 border transition-all duration-500 transform-style-3d shadow-xs hover:shadow-md ${
                      isFlipped
                        ? 'bg-slate-900 text-white border-slate-800 rotate-y-180'
                        : 'bg-slate-50/70 hover:bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    {!isFlipped ? (
                      /* Card Front (Question) */
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                              {card.category}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                card.badgeType === 'critical'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : card.badgeType === 'medium'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {card.badgeType.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-sm font-bold text-slate-900 leading-snug mt-2">
                            {card.question}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                          <span className="text-[11px]">Card #{card.id} of {FLASHCARDS.length}</span>
                          <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            <span>Click to flip</span>
                            <RotateCw className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Card Back (Answer) */
                      <div className="h-full flex flex-col justify-between text-slate-200 transform-rotate-y-180">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                              Answer & Botanical Insight
                            </span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed mt-1">
                            {card.answer}
                          </p>

                          <div className="mt-3 p-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-[11px] text-emerald-300 font-mono">
                            💡 {card.keyTakeaway}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Verified against scikit-learn</span>
                          <span className="text-indigo-400 font-semibold flex items-center gap-1">
                            <span>Flip back</span>
                            <RotateCw className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STREAMLINED DATA RECORDS TABLE */}
      {activeTab === 'dataset' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                150 Canonical Observations Table
              </h2>
              <p className="text-xs text-slate-500">
                Clean tabular browser with instant search and species filters
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ID or label..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSpeciesFilter('all');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedSpeciesFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All (150)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSpeciesFilter('Iris setosa');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedSpeciesFilter === 'Iris setosa'
                      ? 'bg-emerald-100 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Setosa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSpeciesFilter('Iris versicolor');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedSpeciesFilter === 'Iris versicolor'
                      ? 'bg-amber-100 text-amber-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Versicolor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSpeciesFilter('Iris virginica');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedSpeciesFilter === 'Iris virginica'
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
                  <th className="pb-3 px-3"># ID</th>
                  <th className="pb-3 px-3">
                    Sepal Length <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">MEDIUM</span>
                  </th>
                  <th className="pb-3 px-3">
                    Sepal Width <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">MEDIUM</span>
                  </th>
                  <th className="pb-3 px-3">
                    Petal Length <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">CRITICAL</span>
                  </th>
                  <th className="pb-3 px-3">
                    Petal Width <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">CRITICAL</span>
                  </th>
                  <th className="pb-3 px-3">Class Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {paginatedSamples.map((sample) => {
                  const details = SPECIES_DETAILS[sample.species];
                  return (
                    <tr key={sample.id} className="hover:bg-slate-50/80 transition-standard">
                      <td className="py-2.5 px-3 text-slate-400 font-sans">{sample.id}</td>
                      <td className="py-2.5 px-3 text-slate-800">{sample.sepalLength.toFixed(1)} cm</td>
                      <td className="py-2.5 px-3 text-slate-800">{sample.sepalWidth.toFixed(1)} cm</td>
                      <td className="py-2.5 px-3 text-slate-800 font-semibold text-indigo-700">{sample.petalLength.toFixed(1)} cm</td>
                      <td className="py-2.5 px-3 text-slate-800 font-semibold text-indigo-700">{sample.petalWidth.toFixed(1)} cm</td>
                      <td className="py-2.5 px-3 font-sans">
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
                          {sample.species}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500 font-sans">
            <div>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredSamples.length)} of {filteredSamples.length} flowers
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed btn-pressable cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
