import React from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Bot, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  CheckSquare, 
  ChevronRight, 
  SlidersHorizontal,
  FileSpreadsheet,
  Receipt,
  FileText,
  Layers,
  FolderArchive,
  ArrowUpRight
} from 'lucide-react';
import { formatINR } from '../utils/pdfGenerator';

export const DashboardPage: React.FC = () => {
  const { 
    currentProfile, 
    complianceList, 
    summary, 
    gstSummary,
    vaultDocuments,
    setActiveView, 
    setSelectedComplianceDetail, 
    toggleTaskStatus,
    demoProfiles,
    switchProfile
  } = useCompliance();

  const upcomingItems = [...complianceList]
    .filter(item => item.status !== 'completed')
    .sort((a, b) => a.dueDaysRemaining - b.dueDaysRemaining)
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Top Greeting & Business Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#12151D] via-[#0D0F15] to-[#12151D] border border-white/10 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B69AFF]">
            <Sparkles className="w-3.5 h-3.5 text-[#9466FF]" />
            <span>AI Compliance & Document Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Welcome back, {currentProfile.name}
          </h1>
          <p className="text-sm text-[#9295A5] flex items-center gap-2 flex-wrap">
            <span>Here's your business compliance overview for</span>
            <span className="text-white font-semibold underline decoration-[#9466FF]/60 underline-offset-4">
              {currentProfile.businessName}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#9295A5]">
              {currentProfile.businessType}
            </span>
          </p>
        </div>

        {/* Demo Switcher Quick Pill */}
        <div className="z-10 flex items-center gap-2">
          <div className="text-xs text-[#9295A5] hidden sm:block">Demo Profile:</div>
          <select
            value={currentProfile.id}
            onChange={(e) => switchProfile(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#08090D] border border-white/15 text-xs text-white font-medium focus:outline-none focus:border-[#9466FF]"
          >
            {demoProfiles.map(p => (
              <option key={p.id} value={p.id}>
                {p.businessName} ({p.businessType})
              </option>
            ))}
          </select>
        </div>

        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-[#9466FF]/10 to-transparent pointer-events-none" />
      </div>

      {/* Primary Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Health Score with Circular Ring */}
        <div className="p-5 rounded-2xl bg-[#12151D] border border-white/10 flex items-center gap-4 relative overflow-hidden group hover:border-[#9466FF]/40 transition-all">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke={summary.healthScore > 75 ? '#34D399' : summary.healthScore > 50 ? '#FBBF24' : '#F87171'}
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - summary.healthScore / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-white">
              {summary.healthScore}%
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs uppercase font-medium tracking-wider text-[#9295A5]">Compliance Health</span>
            <div className="text-xs font-semibold text-emerald-400">
              {summary.healthScore >= 80 ? 'Good Standing' : 'Needs Action'}
            </div>
            <div className="text-[10px] text-[#9295A5]">{summary.pending} tasks pending</div>
          </div>
        </div>

        {/* Card 2: Total Obligations */}
        <div className="p-5 rounded-2xl bg-[#12151D] border border-white/10 space-y-2 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-xs text-[#9295A5]">
            <span>Total Obligations</span>
            <FileText className="w-4 h-4 text-[#6C8FFF]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">
            {summary.total}
          </div>
          <div className="text-[11px] text-[#9295A5]">
            Applicable to {currentProfile.locationState}
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="p-5 rounded-2xl bg-[#12151D] border border-white/10 space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-[#9295A5]">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-display">
            {summary.completed}
          </div>
          <div className="text-[11px] text-emerald-400/80">
            {Math.round((summary.completed / (summary.total || 1)) * 100)}% filed & confirmed
          </div>
        </div>

        {/* Card 4: Pending */}
        <div className="p-5 rounded-2xl bg-[#12151D] border border-white/10 space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-[#9295A5]">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-display">
            {summary.pending}
          </div>
          <div className="text-[11px] text-amber-400/80">
            {summary.dueWithin7Days} due within 7 days
          </div>
        </div>

        {/* Card 5: Overdue */}
        <div className="p-5 rounded-2xl bg-[#12151D] border border-rose-500/20 bg-rose-500/[0.02] space-y-2 hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-rose-300">
            <span>Overdue Action</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-display">
            {summary.overdue}
          </div>
          <div className="text-[11px] text-rose-300/80">
            {summary.overdue > 0 ? 'Late fee accumulating' : 'All clear'}
          </div>
        </div>

      </div>

      {/* DOCUMENT AUTOMATION OVERVIEW (Section 7 requirement: 3 action cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#9466FF]" />
            <span>Document Automation Overview</span>
          </h2>
          <span className="text-xs text-[#9295A5]">Instant Document Creation Suite</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Card 1: Prepare GST Return */}
          <div 
            onClick={() => setActiveView('gst-automation')}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#12151D] to-[#181C26] border border-white/10 hover:border-[#9466FF]/50 cursor-pointer transition-all space-y-3 group shadow-card"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#9466FF]/20 text-[#B69AFF] flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#9295A5] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Prepare GST Return</h3>
              <p className="text-xs text-[#9295A5] mt-1">
                Upload sales register spreadsheets, detect duplicate invoices, and compute net CGST/SGST/IGST liability.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-[#B69AFF] font-medium border-t border-white/5">
              <span>{gstSummary.totalRecords} Records Prepared</span>
              <span className="font-mono">{formatINR(gstSummary.totalTax)}</span>
            </div>
          </div>

          {/* Action Card 2: Generate Invoice */}
          <div 
            onClick={() => setActiveView('document-studio')}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#12151D] to-[#181C26] border border-white/10 hover:border-[#6C8FFF]/50 cursor-pointer transition-all space-y-3 group shadow-card"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#6C8FFF]/20 text-[#6C8FFF] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#9295A5] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Generate Tax Invoice</h3>
              <p className="text-xs text-[#9295A5] mt-1">
                Create Section 31 compliant B2B invoices with auto intra-state vs inter-state tax split and PDF export.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-[#6C8FFF] font-medium border-t border-white/5">
              <span>GST Compliant Template</span>
              <span>Instant PDF</span>
            </div>
          </div>

          {/* Action Card 3: Create Agreement */}
          <div 
            onClick={() => setActiveView('document-studio')}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#12151D] to-[#181C26] border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-all space-y-3 group shadow-card"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#9295A5] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Create Agreement</h3>
              <p className="text-xs text-[#9295A5] mt-1">
                Draft NDAs, master services agreements, employment contracts and advisory agreements for legal review.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-emerald-400 font-medium border-t border-white/5">
              <span>6 Editable Legal Drafts</span>
              <span>Copy & PDF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Deadlines + AI Insights & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Upcoming Deadlines + Document Activity */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upcoming Deadlines */}
          <div className="p-6 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#9466FF]" />
                  <span>Upcoming Deadlines & Obligations</span>
                </h2>
                <p className="text-xs text-[#9295A5]">
                  Statutory deadlines prioritized for {currentProfile.businessName}.
                </p>
              </div>

              <button
                onClick={() => setActiveView('tasks')}
                className="text-xs font-semibold text-[#B69AFF] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View All ({complianceList.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingItems.map((item) => {
                const isOverdue = item.status === 'overdue';
                const isUrgent = item.dueDaysRemaining <= 7 && item.dueDaysRemaining >= 0;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isOverdue 
                        ? 'bg-rose-500/[0.04] border-rose-500/30' 
                        : isUrgent 
                        ? 'bg-amber-500/[0.03] border-amber-500/20' 
                        : 'bg-[#12151D] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => setSelectedComplianceDetail(item)}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-2 h-2 rounded-full ${
                          isOverdue ? 'bg-rose-400 animate-ping' : isUrgent ? 'bg-amber-400' : 'bg-[#9466FF]'
                        }`} />
                        <span className="text-xs font-medium text-[#9295A5]">
                          {item.responsibleAuthority}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300">
                          {item.category}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-semibold text-white hover:text-[#B69AFF] transition-colors">
                        {item.name}
                      </h3>
                      
                      <p className="text-xs text-[#9295A5] line-clamp-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-white">{item.dueDate}</div>
                        <div className={`text-[11px] font-medium ${
                          isOverdue ? 'text-rose-400 font-bold' : isUrgent ? 'text-amber-400 font-semibold' : 'text-[#B69AFF]'
                        }`}>
                          {isOverdue ? `${Math.abs(item.dueDaysRemaining)} days overdue` : `Due in ${item.dueDaysRemaining} days`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedComplianceDetail(item)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#F4F3FA] transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => toggleTaskStatus(item.id)}
                          className="p-1.5 rounded-lg bg-[#9466FF]/20 hover:bg-[#9466FF]/30 text-[#B69AFF] transition-colors"
                          title="Mark completed"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DOCUMENT ACTIVITY (Section 7 requirement: Most recently generated documents) */}
          <div className="p-6 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-[#6C8FFF]" />
                  <span>Recent Document Activity</span>
                </h3>
                <p className="text-xs text-[#9295A5]">Most recently compiled compliance filings and invoices.</p>
              </div>

              <button
                onClick={() => setActiveView('document-vault')}
                className="text-xs font-semibold text-[#B69AFF] hover:underline"
              >
                Open Vault ({vaultDocuments.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {vaultDocuments.slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl bg-[#12151D] border border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{doc.title}</div>
                    <div className="text-[11px] text-[#9295A5]">{doc.category} • Generated {doc.generatedDate} • {doc.fileSize}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono">
                    {doc.fileType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="p-5 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-wider text-[#9295A5]">
              Quick Founder Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveView('ai-assistant')}
                className="p-3.5 rounded-xl bg-[#12151D] border border-white/5 hover:border-[#9466FF]/40 text-left transition-all group"
              >
                <Bot className="w-5 h-5 text-[#9466FF] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">Discover Compliances</div>
                <div className="text-[10px] text-[#9295A5]">AI Onboarding interview</div>
              </button>

              <button
                onClick={() => setActiveView('gst-automation')}
                className="p-3.5 rounded-xl bg-[#12151D] border border-white/5 hover:border-[#6C8FFF]/40 text-left transition-all group"
              >
                <FileSpreadsheet className="w-5 h-5 text-[#6C8FFF] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">Prepare GST Data</div>
                <div className="text-[10px] text-[#9295A5]">Process sales registers</div>
              </button>

              <button
                onClick={() => setActiveView('document-studio')}
                className="p-3.5 rounded-xl bg-[#12151D] border border-white/5 hover:border-emerald-500/40 text-left transition-all group"
              >
                <Receipt className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">Generate Document</div>
                <div className="text-[10px] text-[#9295A5]">Invoices & Agreements</div>
              </button>

              <button
                onClick={() => setActiveView('calendar')}
                className="p-3.5 rounded-xl bg-[#12151D] border border-white/5 hover:border-amber-500/40 text-left transition-all group"
              >
                <CalendarIcon className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">View Calendar</div>
                <div className="text-[10px] text-[#9295A5]">Monthly deadlines</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: AI Insights + Risk Overview */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: AI Compliance Insights */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12151D] via-[#0D0F15] to-[#181C26] border border-[#9466FF]/30 shadow-glow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9466FF] flex items-center justify-center text-white shadow-glow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Your AI Compliance Insights</h3>
                <span className="text-[10px] text-[#B69AFF] font-mono">Automated Intelligence</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-200 leading-relaxed space-y-2">
              <p>
                <strong>Observation:</strong> Your business has {summary.pending} upcoming compliance deadlines. One obligation (EPF voluntary coverage) requires additional verification. Review your compliance checklist.
              </p>
              <p className="text-[11px] text-[#9295A5]">
                {currentProfile.businessType === 'Private Limited Company'
                  ? 'GSTR-3B is approaching in 6 days. Your GST Automation Studio has 18 invoices pre-organized.'
                  : 'Sole proprietorship obligations are streamlined, focused on direct tax and state permits.'}
              </p>
            </div>

            <button
              onClick={() => setActiveView('ai-assistant')}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-[#9466FF] hover:bg-[#8350fa] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Ask AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card: Risk & Status Distribution */}
          <div className="p-6 rounded-2xl bg-[#0D0F15] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Risk & Filing Distribution</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#9295A5]" />
            </h3>

            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${(summary.completed / (summary.total || 1)) * 100}%` }} 
                className="bg-emerald-400 transition-all duration-500" 
              />
              <div 
                style={{ width: `${(summary.dueWithin7Days / (summary.total || 1)) * 100}%` }} 
                className="bg-amber-400 transition-all duration-500" 
              />
              <div 
                style={{ width: `${(summary.overdue / (summary.total || 1)) * 100}%` }} 
                className="bg-rose-500 transition-all duration-500" 
              />
              <div 
                style={{ width: `${((summary.pending - summary.dueWithin7Days) / (summary.total || 1)) * 100}%` }} 
                className="bg-[#9466FF] transition-all duration-500" 
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#12151D] border border-white/5">
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Overdue Items
                </span>
                <span className="font-bold text-rose-400">{summary.overdue}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#12151D] border border-white/5">
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Due within 7 Days
                </span>
                <span className="font-bold text-amber-400">{summary.dueWithin7Days}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#12151D] border border-white/5">
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9466FF]"></span> Due within 30 Days
                </span>
                <span className="font-bold text-[#B69AFF]">{summary.dueWithin30Days}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#12151D] border border-white/5">
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Completed Items
                </span>
                <span className="font-bold text-emerald-400">{summary.completed}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
