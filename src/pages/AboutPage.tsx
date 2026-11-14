import React from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Bot, 
  Cpu, 
  Layers, 
  Building2, 
  FileSpreadsheet,
  Receipt,
  FileText,
  Calendar,
  FolderArchive,
  ArrowRight 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView } = useCompliance();

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-16">
      
      {/* Editorial Hero */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9466FF]/15 border border-[#9466FF]/30 text-xs font-semibold text-[#B69AFF]">
          <Shield className="w-3.5 h-3.5" />
          <span>Product Architecture & Transparency</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
          Making business compliance <br />
          <span className="bg-gradient-to-r from-[#B69AFF] via-[#9466FF] to-[#6C8FFF] bg-clip-text text-transparent">
            simpler and smarter.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#9295A5] max-w-2xl mx-auto leading-relaxed">
          COMPLIO is an intelligent business compliance and document automation assistant designed to help Indian startup founders understand their obligations, prepare essential tax documents and stay ahead of filing deadlines.
        </p>
      </div>

      {/* Decision-Support Disclaimer Callout */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 space-y-2">
        <div className="flex items-center gap-2.5 font-bold text-amber-300 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Important Disclaimer: Decision-Support & Document Preparation Tool</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-200/80">
          COMPLIO is an operational decision-support and document-preparation software platform. It does not replace professional Chartered Accountant (CA), Company Secretary (CS), tax or legal advice. All statutory filing requirements, GST calculations, penalty figures, and due dates must be verified with official government portals and a qualified professional before official submission.
        </p>
      </div>

      {/* Visual Platform Workflow Matrix (Requested in Section 18) */}
      <div className="p-8 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white font-display">How COMPLIO Operates End-to-End</h2>
          <p className="text-xs text-[#9295A5]">Integrated 4-stage operational pipeline for early-stage ventures.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#9466FF]/20 text-[#B69AFF] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="text-xs font-bold text-white">AI Interview</h4>
            <p className="text-[11px] text-[#9295A5]">Discovers entity parameters, headcount & turnover triggers without jargon.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#6C8FFF]/20 text-[#6C8FFF] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="text-xs font-bold text-white">Rules Calibration</h4>
            <p className="text-[11px] text-[#9295A5]">Matches MCA, GSTN, CBDT and State Labour rules deterministically.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="text-xs font-bold text-white">Document Automation</h4>
            <p className="text-[11px] text-[#9295A5]">Validates spreadsheets, detects duplicate invoices & drafts agreements.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="text-xs font-bold text-white">Vault & Reminders</h4>
            <p className="text-[11px] text-[#9295A5]">Preserves generated records and simulates 7-day proactive deadline alerts.</p>
          </div>
        </div>
      </div>

      {/* Deep-dive sections */}
      <div className="space-y-6">
        
        {/* Section 1: Why COMPLIO Exists */}
        <div className="p-8 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#9466FF]" />
            <h3 className="text-base font-bold text-white font-display">1. Why COMPLIO Exists</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            In India, startup founders must navigate disparate statutory bodies: MCA (Companies Act), CBIC/GSTN (Goods and Services Tax), CBDT (Income Tax & TDS), EPFO/ESIC (Labour compliance), and state commercial tax departments for Professional Tax. Managing this manually across fragmented WhatsApp chats and disorganized spreadsheets leads to compounding late fees (up to ₹100/day for MCA defaults) and blocked buyer input tax credit. COMPLIO provides a unified, local software solution.
          </p>
        </div>

        {/* Section 2: AI Compliance Intelligence */}
        <div className="p-8 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-[#6C8FFF]" />
            <h3 className="text-base font-bold text-white font-display">2. AI Compliance Intelligence</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            COMPLIO interviews founders conversationally. Rather than requiring legal expertise, it determines applicability based on facts (structure, state, turnover, employee count, GST registration, foreign capital). Items requiring formal ledger audit are transparently labeled "Needs CA Verification" rather than making hazardous assumptions.
          </p>
        </div>

        {/* Section 3: GST Document Preparation */}
        <div className="p-8 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-display">3. GST Document Preparation</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Our highest-priority feature parses raw sales spreadsheets and credit notes right inside the browser. It detects duplicate invoice numbers (such as INV-2026-004), flags missing recipient GSTINs, checks place-of-supply arithmetic, and generates comprehensive GST reconciliation summaries and audit PDFs.
          </p>
        </div>

        {/* Section 4: Invoice and Agreement Automation */}
        <div className="p-8 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-[#B69AFF]" />
            <h3 className="text-base font-bold text-white font-display">4. Invoice and Agreement Automation</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Through the Document Studio, founders can generate professional Section 31 tax invoices with dynamic intra-state (CGST + SGST) versus inter-state (IGST) calculations. It also features editable templates for mutual NDAs, master service agreements, contractor terms, and advisory agreements with live text editing and PDF export.
          </p>
        </div>

        {/* Section 5: Deadline Management & Document Organization */}
        <div className="p-8 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <FolderArchive className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">5. Deadline Management & Centralized Vault</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Our interactive monthly calendar plots filing cut-offs, while simulated notification triggers warn founders 7 days in advance. All generated reports, invoices and agreement drafts are cataloged in the local Document Vault for immediate access.
          </p>
        </div>

      </div>

      {/* Return to Dashboard CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#9466FF]/20 via-[#12151D] to-[#6C8FFF]/20 border border-[#9466FF]/30 text-center space-y-4">
        <h3 className="text-xl font-bold text-white font-display">Experience the COMPLIO Platform</h3>
        <p className="text-xs text-[#9295A5] max-w-md mx-auto">
          Explore the GST Automation Studio, run the AI Onboarding interview, or draft an invoice using our live local MVP.
        </p>
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] text-white text-xs font-bold shadow-glow hover:opacity-90 transition-all inline-flex items-center gap-2"
        >
          <span>Open Main Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
