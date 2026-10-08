/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  Sparkles,
  BarChart3,
  ScatterChart,
  BookOpen,
  FileSpreadsheet,
  Download,
  Menu,
  X,
  Code2,
  Flower2,
  User,
  LogOut,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { HomePage, UserSession } from './components/HomePage';
import { PredictSection } from './components/PredictSection';
import { BatchAnalyticsSection } from './components/BatchAnalyticsSection';
import { PerformanceSection } from './components/PerformanceSection';
import { VisualizationSection } from './components/VisualizationSection';
import { AboutSection } from './components/AboutSection';
import { LocalSetupModal } from './components/LocalSetupModal';
import { ReportModal } from './components/ReportModal';
import { BrandLogo } from './components/BrandLogo';
import { AiChatBox } from './components/AiChatBox';

type DashboardSection = 'predict' | 'batch' | 'performance' | 'visualization' | 'about';

interface NavItem {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    id: 'predict',
    label: 'Predict Species',
    icon: Sparkles,
    description: 'Classify flower specimen'
  },
  {
    id: 'batch',
    label: 'Batch Analytics & Upload',
    icon: FileSpreadsheet,
    description: 'CSV/Excel file upload & stats',
    badge: 'New'
  },
  {
    id: 'performance',
    label: 'Model Performance',
    icon: BarChart3,
    description: '4-Model benchmark & matrix'
  },
  {
    id: 'visualization',
    label: 'Data Visualization',
    icon: ScatterChart,
    description: 'Scatter plot & decision space'
  },
  {
    id: 'about',
    label: 'About Dataset',
    icon: BookOpen,
    description: 'UCI Fisher benchmark data'
  }
];

export default function App() {
  // Navigation view: 'home' (standalone portal) vs 'dashboard' (sidebar ML workspace)
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [currentSection, setCurrentSection] = useState<DashboardSection>('predict');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // User session state
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // Restore stored session if exists
  useEffect(() => {
    try {
      const stored = localStorage.getItem('iris_classifier_user');
      if (stored) {
        setUserSession(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not parse stored session', e);
    }
  }, []);

  // Active prediction shared state to highlight user point in Scatter plot
  const [lastPrediction, setLastPrediction] = useState<{
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: string;
    confidence: number;
  } | null>({
    sepalLength: 5.8,
    sepalWidth: 3.0,
    petalLength: 4.2,
    petalWidth: 1.3,
    species: 'Iris versicolor',
    confidence: 88.5
  });

  const handleNavigateToViz = (features: {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: string;
  }) => {
    setLastPrediction(prev => ({
      ...features,
      confidence: prev?.confidence || 90.0
    }));
    setCurrentSection('visualization');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    localStorage.removeItem('iris_classifier_user');
    setUserSession(null);
    setCurrentView('home');
  };

  // If user is on the standalone Home page, DO NOT render the dashboard sidebar!
  if (currentView === 'home') {
    return (
      <>
        <HomePage
          userSession={userSession}
          onLoginSuccess={(session) => {
            setUserSession(session);
          }}
          onEnterDashboard={() => {
            setCurrentView('dashboard');
            setCurrentSection('predict');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />

        {/* Report Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          lastPrediction={lastPrediction}
        />
      </>
    );
  }

  // Dashboard Sidebar Content
  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Project Logo & Title */}
        <div className="p-5 border-b border-slate-800/80">
          <BrandLogo size="md" variant="dark" />
        </div>

        {/* Back to Home Portal Button */}
        <div className="px-4 pt-3 pb-1">
          <button
            type="button"
            onClick={() => {
              setCurrentView('home');
              setIsMobileDrawerOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-slate-700/60 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Return to Home Portal</span>
          </button>
        </div>

        {/* Vertical Navigation Items */}
        <nav className="p-4 space-y-1" aria-label="Dashboard Navigation">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            ML Dashboard Tools
          </div>

          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentSection(item.id);
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-standard relative group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md transition-all" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer with Session status, Download Report & Python Local Run buttons */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        {/* User Session status banner */}
        {userSession ? (
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-white truncate">
                  {userSession.email.split('@')[0]}
                </div>
                <div className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified Account
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <User className="w-3 h-3 text-indigo-400" />
            <span>Sign In / Verify Email</span>
          </button>
        )}

        {/* Download Report Option on Left Sidebar */}
        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold shadow-sm border border-indigo-400/30 btn-pressable cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-indigo-100" />
            <span>Download Report</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-800/90 text-indigo-100">
            PDF/CSV
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsSetupModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium border border-slate-700/70 btn-pressable cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Python & Flask</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
            Guide
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Inter',sans-serif] text-slate-800">
      {/* 1. Desktop Fixed Left Sidebar (240px) */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-[240px] bg-[#1E293B] z-30 shadow-md border-r border-slate-800">
        {navContent}
      </aside>

      {/* 2. Mobile Floating Menu Trigger */}
      <div className="md:hidden fixed top-3 left-3 z-40">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open Navigation Sidebar"
          className="p-2.5 rounded-xl bg-[#1E293B] text-white shadow-md border border-slate-700 btn-pressable cursor-pointer flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* 3. Mobile Slide-in Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <div className="relative flex flex-col w-[260px] max-w-[80%] bg-[#1E293B] h-full shadow-2xl z-10 animate-fade-in-up">
            <div className="absolute top-4 right-3">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-label="Close Navigation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}

      {/* 4. Main Content Area */}
      <main className="flex-1 md:ml-[240px] flex flex-col justify-between min-h-screen">
        <div>
          {/* Top-Center Header Bar with Distinctive Logo */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 shadow-xs">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              {/* Left breadcrumb */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 pl-8 md:pl-0">
                <span className="font-semibold text-slate-800">Dashboard</span>
                <span>/</span>
                <span className="text-slate-600 font-medium">
                  {DASHBOARD_NAV_ITEMS.find(n => n.id === currentSection)?.label}
                </span>
              </div>

              {/* TOP-CENTER A GOOD LOGO (Prominently Centered) */}
              <div
                onClick={() => setCurrentView('home')}
                className="flex items-center justify-center mx-auto cursor-pointer group"
                title="Return to Home Portal"
              >
                <BrandLogo size="md" variant="classic" />
              </div>

              {/* Right Quick Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('home')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  <span>Home Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs btn-pressable cursor-pointer"
                  title="Export technical report"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Report</span>
                </button>
              </div>
            </div>
          </header>

          {/* Section Body */}
          <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            <div key={currentSection} className="transition-standard">
              {currentSection === 'predict' && (
                <PredictSection
                  onNavigateToViz={handleNavigateToViz}
                  lastPrediction={lastPrediction}
                  setLastPrediction={setLastPrediction}
                />
              )}

              {currentSection === 'batch' && (
                <BatchAnalyticsSection
                  onOpenReportModal={() => setIsReportModalOpen(true)}
                />
              )}

              {currentSection === 'performance' && <PerformanceSection />}

              {currentSection === 'visualization' && (
                <VisualizationSection userPoint={lastPrediction} />
              )}

              {currentSection === 'about' && <AboutSection />}
            </div>
          </div>
        </div>

        {/* Global minimal footer */}
        <footer className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" variant="classic" showSubtitle={false} />
            <span className="text-slate-400">•</span>
            <span>Fisher's Iris Taxonomic Benchmark (1936)</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold text-slate-700"
            >
              <Home className="w-3.5 h-3.5 text-indigo-500" /> Home Portal
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold text-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" /> Download Report
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSetupModalOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Code2 className="w-3.5 h-3.5" /> Local Python Setup
            </button>
          </div>
        </footer>
      </main>

      {/* Download Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        lastPrediction={lastPrediction}
      />

      {/* Local Python Setup & Code Modal */}
      <LocalSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />

      {/* AI Assistant Chat Box on Dashboard */}
      <AiChatBox />
    </div>
  );
}
