import React from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { setActiveView } = useCompliance();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08090D]/80 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9466FF] to-[#6C8FFF] flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-1.5">
              COMPLIO
              <span className="w-1.5 h-1.5 rounded-full bg-[#9466FF] animate-pulse"></span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#9295A5] block font-mono">
              Compliance Intelligence
            </span>
          </div>
        </div>

        {/* Marketing Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9295A5]">
          <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <button 
            onClick={() => setActiveView('about')}
            className="hover:text-white transition-colors"
          >
            About
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('login')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#F4F3FA] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            Sign In
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="group relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-95 shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </header>
  );
};

