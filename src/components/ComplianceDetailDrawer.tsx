import React from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileText,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

export const ComplianceDetailDrawer: React.FC = () => {
  const { 
    selectedComplianceDetail, 
    setSelectedComplianceDetail, 
    toggleTaskStatus,
    setActiveView 
  } = useCompliance();

  if (!selectedComplianceDetail) return null;

  const item = selectedComplianceDetail;
  const isCompleted = item.status === 'completed';
  const isOverdue = item.status === 'overdue';
  const isVerification = item.status === 'needs_ca_verification';
  const isGST = item.category === 'Tax & GST' || item.name.toLowerCase().includes('gst');

  const handlePrepareDocument = () => {
    setSelectedComplianceDetail(null);
    if (isGST) {
      setActiveView('gst-automation');
    } else {
      setActiveView('document-studio');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={() => setSelectedComplianceDetail(null)} 
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-[#0D0F15] border-l border-white/10 h-full overflow-y-auto shadow-2xl flex flex-col z-10 transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 sticky top-0 bg-[#0D0F15]/95 backdrop-blur-md z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#9466FF]/15 text-[#B69AFF] border border-[#9466FF]/30">
                {item.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                {item.frequency}
              </span>
              {isVerification && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Needs CA Verification
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#F4F3FA] leading-tight">
              {item.name}
            </h2>
          </div>
          <button
            onClick={() => setSelectedComplianceDetail(null)}
            className="p-2 rounded-lg text-[#9295A5] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Status & Quick Action Card */}
          <div className="p-4 rounded-xl bg-[#12151D] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${
                isCompleted 
                  ? 'bg-emerald-500/15 text-emerald-400' 
                  : isOverdue 
                  ? 'bg-rose-500/15 text-rose-400' 
                  : 'bg-[#9466FF]/15 text-[#B69AFF]'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isOverdue ? <ShieldAlert className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs text-[#9295A5] uppercase tracking-wider font-medium">Current Status</p>
                <p className="text-sm font-semibold capitalize text-[#F4F3FA]">
                  {item.status.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleTaskStatus(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                isCompleted
                  ? 'bg-white/10 hover:bg-white/15 text-white'
                  : 'bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-90 text-white shadow-glow'
              }`}
            >
              {isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            </button>
          </div>

          {/* Section 14 Requirement: "Prepare Related Document" Button */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#9466FF]/15 to-[#6C8FFF]/15 border border-[#9466FF]/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#9466FF]" />
                <span>Automated Document Workflow Available</span>
              </span>
              <p className="text-[11px] text-[#9295A5]">
                {isGST ? 'Extract sales records and compile GSTR returns.' : 'Generate supporting agreements or certificates.'}
              </p>
            </div>
            <button
              onClick={handlePrepareDocument}
              className="px-3.5 py-1.5 rounded-lg bg-[#9466FF] hover:bg-[#8350fa] text-xs font-semibold text-white transition-colors flex items-center gap-1 shrink-0 shadow-sm"
            >
              <span>Prepare Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Due Date & Authority info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#12151D] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#9295A5]">
                <Calendar className="w-3.5 h-3.5 text-[#9466FF]" />
                <span>Illustrative Deadline</span>
              </div>
              <p className="text-sm font-semibold text-white">{item.dueDate}</p>
              <p className={`text-xs ${
                isCompleted ? 'text-emerald-400' : isOverdue ? 'text-rose-400 font-semibold' : 'text-[#B69AFF]'
              }`}>
                {isCompleted ? 'Completed' : isOverdue ? `${Math.abs(item.dueDaysRemaining)} days overdue` : `Due in ${item.dueDaysRemaining} days`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#12151D] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#9295A5]">
                <Building2 className="w-3.5 h-3.5 text-[#6C8FFF]" />
                <span>Responsible Authority</span>
              </div>
              <p className="text-xs font-semibold text-white line-clamp-2">{item.responsibleAuthority}</p>
            </div>
          </div>

          {/* Section: What is this compliance? */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-[#9295A5] font-semibold flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#9466FF]" />
              What is this compliance?
            </h3>
            <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 text-sm text-gray-300 leading-relaxed">
              {item.description}
            </div>
          </div>

          {/* Section: Why might it apply to your business? */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-[#9295A5] font-semibold flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#6C8FFF]" />
              Why might it apply to your business?
            </h3>
            <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 text-sm text-[#F4F3FA] leading-relaxed border-l-4 border-l-[#9466FF]">
              {item.applicabilityReason}
            </div>
          </div>

          {/* Section: Consequences of missing it */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-[#9295A5] font-semibold flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Consequences & Sample Penalty
            </h3>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200/90 leading-relaxed">
              <p>{item.samplePenalty}</p>
              <p className="mt-2 text-xs text-amber-400/70 italic">
                * Illustrative demo model for educational tracking. Statutory penalties vary by specific contravention and case law.
              </p>
            </div>
          </div>

          {/* Official Source Link */}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#12151D] border border-white/10 text-sm text-[#B69AFF] hover:border-[#9466FF]/50 transition-colors group"
            >
              <span className="flex items-center gap-2 text-gray-300 group-hover:text-white">
                <ExternalLink className="w-4 h-4 text-[#9466FF]" />
                Official Portal: {new URL(item.sourceUrl).hostname}
              </span>
              <span className="text-xs text-[#9295A5] group-hover:text-[#B69AFF]">Open ↗</span>
            </a>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0D0F15] flex justify-between items-center text-xs text-[#9295A5]">
          <span>COMPLIO Rule ID: {item.id}</span>
          <button
            onClick={() => setSelectedComplianceDetail(null)}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
