"use client";
import { Menu, X, Cpu } from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function TopNav({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Mes<span className="text-emerald-400 font-semibold">Industry</span>
            </span>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-mono">Ecosistema Industriale 4.0</p>
          </div>
        </div>

        <nav className="hidden md:flex space-x-1">
          {['overview', 'architecture', 'slides', 'multisite'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                activeTab === tab
                  ? 'bg-slate-800 text-emerald-400 shadow-inner border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab === 'overview'
                ? "Visione d'Insieme"
                : tab === 'architecture'
                ? 'Architettura 4.0'
                : tab === 'slides'
                ? 'Slide Presentazione ⏱️'
                : 'Governance Multi-Sito'}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg px-4 py-4 space-y-1">
          {['overview', 'architecture', 'slides', 'multisite'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium block ${
                activeTab === tab ? 'bg-slate-900 text-emerald-400' : 'text-slate-400'
              }`}
            >
              {tab === 'overview'
                ? "Visione d'Insieme"
                : tab === 'architecture'
                ? 'Architettura 4.0'
                : tab === 'slides'
                ? 'Slide Presentazione'
                : 'Governance Multi-Sito'}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
