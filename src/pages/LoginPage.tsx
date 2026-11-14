import React, { useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  Building, 
  Mail, 
  User, 
  Check, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { DEMO_PROFILES } from '../data/demoProfiles';

export const LoginPage: React.FC = () => {
  const { 
    setActiveView, 
    currentProfile, 
    updateProfile, 
    switchProfile 
  } = useCompliance();

  const [formData, setFormData] = useState({
    name: currentProfile.name || '',
    email: currentProfile.email || '',
    businessName: currentProfile.businessName || '',
    businessType: currentProfile.businessType || 'Private Limited Company'
  });

  const [selectedDemoId, setSelectedDemoId] = useState<string>(DEMO_PROFILES[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.businessName.trim()) {
      alert('Please fill in your name and business name.');
      return;
    }
    updateProfile({
      name: formData.name,
      email: formData.email,
      businessName: formData.businessName,
      businessType: formData.businessType as any,
      avatarInitials: formData.name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    });
    setActiveView('dashboard');
  };

  const handleInstantDemo = (profileId: string) => {
    switchProfile(profileId);
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col justify-between relative overflow-hidden text-[#F4F3FA] selection:bg-[#9466FF]/30">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#9466FF]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#6C8FFF]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header bar */}
      <header className="p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2 text-xs text-[#9295A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9466FF] to-[#6C8FFF] flex items-center justify-center shadow-glow">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight font-display text-sm">COMPLIO</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9466FF]/15 border border-[#9466FF]/30 text-xs font-semibold text-[#B69AFF]">
            <Sparkles className="w-3 h-3" />
            <span>Interactive Demo Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Welcome to COMPLIO
          </h1>
          <p className="text-sm text-[#9295A5] max-w-md mx-auto">
            Choose an instant founder persona or enter custom business details to explore the live compliance tracker.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Demo Persona Selector */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs uppercase tracking-wider font-mono text-[#9295A5] flex items-center justify-between">
              <span>Option A: Instant Demo Accounts</span>
              <span className="text-[#9466FF] font-semibold">1-Click Access</span>
            </div>

            <div className="space-y-3">
              {DEMO_PROFILES.map((p) => {
                const isSelected = selectedDemoId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedDemoId(p.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#12151D] border-[#9466FF] shadow-glow'
                        : 'bg-[#0D0F15] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected ? 'bg-[#9466FF] text-white' : 'bg-white/5 text-[#9295A5]'
                        }`}>
                          {p.avatarInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{p.businessName}</div>
                          <div className="text-xs text-[#9295A5]">{p.name} • {p.email}</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'border-[#9466FF] bg-[#9466FF] text-white' : 'border-white/20'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300">
                        {p.businessType}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300">
                        {p.locationState}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300">
                        {p.turnoverRange}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300">
                        {p.employeeCount} team
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instant Demo Launch Button */}
            <button
              onClick={() => handleInstantDemo(selectedDemoId)}
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-95 shadow-glow transition-all flex items-center justify-center gap-2 group"
            >
              <UserCheck className="w-4 h-4" />
              <span>Launch Demo With Selected Persona</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right Column: Custom Info Entry */}
          <div className="lg:col-span-6 bg-[#0D0F15] rounded-2xl border border-white/10 p-6 space-y-5">
            <div className="text-xs uppercase tracking-wider font-mono text-[#9295A5]">
              Option B: Custom Founder Details
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#9466FF]" /> Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#9466FF] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#6C8FFF]" /> Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. founder@startup.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#9466FF] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" /> Business / Entity Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. NovaTech Solutions Pvt Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#9466FF] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">
                  Entity Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#9466FF]"
                >
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership Firm</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-[11px] text-[#9295A5] text-center">
              No password or OTP required. Stored securely in your browser's local state.
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[#9295A5] border-t border-white/5">
        COMPLIO Local Buildathon Edition • Decision Support Tool
      </footer>

    </div>
  );
};

