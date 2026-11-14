import React, { useState, useMemo } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  ArrowUpDown,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { ComplianceCategory, ComplianceStatus } from '../types';

export const MyCompliancePage: React.FC = () => {
  const { 
    complianceList, 
    toggleTaskStatus, 
    setSelectedComplianceDetail,
    currentProfile 
  } = useCompliance();

  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending' | 'overdue' | 'verification'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering
  const filteredItems = useMemo(() => {
    return complianceList.filter(item => {
      // Tab status filter
      if (activeTab === 'completed' && item.status !== 'completed') return false;
      if (activeTab === 'pending' && item.status !== 'pending') return false;
      if (activeTab === 'overdue' && item.status !== 'overdue') return false;
      if (activeTab === 'verification' && item.status !== 'needs_ca_verification') return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Priority filter
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesAuth = item.responsibleAuthority.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesName || matchesAuth || matchesDesc;
      }

      return true;
    });
  }, [complianceList, activeTab, selectedCategory, selectedPriority, searchQuery]);

  const categories: ComplianceCategory[] = [
    'Tax & GST',
    'Corporate & MCA',
    'Labour & Employment',
    'Registrations & Licences',
    'Startup & Banking'
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-[#9466FF]" />
            <span>My Compliance Checklist</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9295A5] mt-1">
            Statutory filings calibrated for <strong>{currentProfile.businessName}</strong> ({currentProfile.businessType})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9295A5]">Showing</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#12151D] border border-white/10 text-xs font-bold text-white">
            {filteredItems.length} of {complianceList.length} Tasks
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1 text-xs sm:text-sm">
        {[
          { id: 'all', label: 'All Obligations', count: complianceList.length },
          { id: 'pending', label: 'Pending', count: complianceList.filter(i => i.status === 'pending').length },
          { id: 'overdue', label: 'Overdue', count: complianceList.filter(i => i.status === 'overdue').length },
          { id: 'completed', label: 'Completed', count: complianceList.filter(i => i.status === 'completed').length },
          { id: 'verification', label: 'Requires CA Check', count: complianceList.filter(i => i.status === 'needs_ca_verification').length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 border-b-2 ${
                isActive
                  ? 'border-[#9466FF] text-white bg-white/[0.04]'
                  : 'border-transparent text-[#9295A5] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-[#9466FF]/20 text-[#B69AFF]' : 'bg-white/5 text-[#9295A5]'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters & Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-[#9295A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by form, act, authority, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#9466FF] text-xs sm:text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Compliance Task Cards Grid */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isCompleted = item.status === 'completed';
          const isOverdue = item.status === 'overdue';
          const isVerification = item.status === 'needs_ca_verification';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-[#0D0F15]/80 border-white/5 opacity-80'
                  : isOverdue
                  ? 'bg-rose-500/[0.03] border-rose-500/30 shadow-sm'
                  : isVerification
                  ? 'bg-amber-500/[0.02] border-amber-500/25'
                  : 'bg-[#12151D] border-white/10 hover:border-[#9466FF]/40'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left: Info */}
                <div 
                  className="space-y-2 flex-1 cursor-pointer"
                  onClick={() => setSelectedComplianceDetail(item)}
                >
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 py-0.5 rounded-md font-medium bg-[#9466FF]/15 text-[#B69AFF] border border-[#9466FF]/30">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300">
                      {item.frequency}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                      item.priority === 'high' ? 'bg-rose-500/15 text-rose-300' : 'bg-gray-500/15 text-gray-300'
                    }`}>
                      {item.priority} Priority
                    </span>
                    {isVerification && (
                      <span className="px-2 py-0.5 rounded-md font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Needs CA Verification
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white hover:text-[#B69AFF] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#9295A5] line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#9295A5] pt-1">
                    <span><strong>Authority:</strong> {item.responsibleAuthority}</span>
                  </div>
                </div>

                {/* Right: Actions & Due Date */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-[#9295A5]">Illustrative Deadline</div>
                    <div className="text-sm font-bold text-white">{item.dueDate}</div>
                    <div className={`text-xs font-semibold ${
                      isCompleted ? 'text-emerald-400' : isOverdue ? 'text-rose-400' : 'text-[#B69AFF]'
                    }`}>
                      {isCompleted ? 'Completed' : isOverdue ? `${Math.abs(item.dueDaysRemaining)} days overdue` : `Due in ${item.dueDaysRemaining} days`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedComplianceDetail(item)}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => toggleTaskStatus(item.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                          : 'bg-[#9466FF] hover:bg-[#8350fa] text-white shadow-glow'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Filed</span>
                        </>
                      ) : (
                        <span>Mark Done</span>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0D0F15] border border-white/5 space-y-3">
            <Info className="w-10 h-10 text-[#9295A5] mx-auto" />
            <h3 className="text-base font-bold text-white">No compliance tasks found</h3>
            <p className="text-xs text-[#9295A5] max-w-sm mx-auto">
              Try adjusting your tab status or clearing your search filters to view your obligations.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

