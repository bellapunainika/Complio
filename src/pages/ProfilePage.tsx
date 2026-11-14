import React, { useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  User, 
  Building, 
  Mail, 
  MapPin, 
  Briefcase, 
  CreditCard, 
  Users, 
  Globe, 
  Bell, 
  Sliders, 
  Save, 
  Edit3, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';
import { BusinessType, TurnoverRange, ForeignInvestmentStatus } from '../types';

export const ProfilePage: React.FC = () => {
  const { 
    currentProfile, 
    updateProfile, 
    summary, 
    switchProfile, 
    demoProfiles,
    resetToDemoDefaults 
  } = useCompliance();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form local state
  const [formData, setFormData] = useState({
    name: currentProfile.name,
    email: currentProfile.email,
    businessName: currentProfile.businessName,
    locationState: currentProfile.locationState,
    businessType: currentProfile.businessType,
    turnoverRange: currentProfile.turnoverRange,
    gstRegistered: currentProfile.gstRegistered,
    employeeCount: currentProfile.employeeCount,
    foreignInvestment: currentProfile.foreignInvestment,
    remindersEnabled: currentProfile.remindersEnabled,
    reminderDaysBefore: currentProfile.reminderDaysBefore,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      avatarInitials: formData.name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-[#9466FF]" />
            <span>Founder & Business Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9295A5] mt-1">
            Manage your legal entity parameters, contact info, and notification triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-90 text-xs sm:text-sm font-semibold text-white shadow-glow transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Business Details</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-semibold text-white border border-white/10 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile parameters updated successfully and saved to localStorage!</span>
        </div>
      )}

      {/* Compliance Overview Metrics Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0D0F15] border border-white/10">
        <div>
          <div className="text-xs text-[#9295A5]">Compliance Health</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{summary.healthScore}%</div>
          <div className="text-[10px] text-[#9295A5]">Active Standing</div>
        </div>
        <div>
          <div className="text-xs text-[#9295A5]">Applicable Filings</div>
          <div className="text-2xl font-bold text-white mt-1">{summary.total}</div>
          <div className="text-[10px] text-[#9295A5]">Statutory tasks</div>
        </div>
        <div>
          <div className="text-xs text-[#9295A5]">Completed</div>
          <div className="text-2xl font-bold text-[#6C8FFF] mt-1">{summary.completed}</div>
          <div className="text-[10px] text-[#9295A5]">Filings confirmed</div>
        </div>
        <div>
          <div className="text-xs text-[#9295A5]">Pending / Overdue</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{summary.pending + summary.overdue}</div>
          <div className="text-[10px] text-[#9295A5]">Action required</div>
        </div>
      </div>

      {/* Main Profile Info or Edit Form */}
      <div className="bg-[#0D0F15] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-8">
        
        {/* Founder Personal Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9466FF] to-[#6C8FFF] flex items-center justify-center text-xl font-bold text-white shadow-glow">
            {currentProfile.avatarInitials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{currentProfile.name}</h2>
            <p className="text-xs text-[#9295A5]">{currentProfile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#9466FF]/20 text-[#B69AFF] font-medium">
                Founder / Primary Director
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300">
                Telangana MCA Jurisdiction
              </span>
            </div>
          </div>
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Update Entity & Founder Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Founder Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Business / Entity Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Operating State</label>
                <input
                  type="text"
                  value={formData.locationState}
                  onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Entity Structure</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
                >
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Annual Turnover Range</label>
                <select
                  value={formData.turnoverRange}
                  onChange={(e) => setFormData({ ...formData, turnoverRange: e.target.value as TurnoverRange })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
                >
                  <option value="Below ₹20 lakh">Below ₹20 lakh</option>
                  <option value="₹20–40 lakh">₹20–40 lakh</option>
                  <option value="₹40 lakh–₹1 crore">₹40 lakh–₹1 crore</option>
                  <option value="₹1–5 crore">₹1–5 crore</option>
                  <option value="Above ₹5 crore">Above ₹5 crore</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Total Employee Headcount</label>
                <input
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9295A5] mb-1.5">Foreign Investment (FDI / VC)</label>
                <select
                  value={formData.foreignInvestment}
                  onChange={(e) => setFormData({ ...formData, foreignInvestment: e.target.value as ForeignInvestmentStatus })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#9466FF]"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-xs font-medium text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] text-xs font-semibold text-white shadow-glow hover:opacity-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes & Recalibrate</span>
              </button>
            </div>
          </form>
        ) : (
          /* Read-only Detailed View */
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-[#9295A5] uppercase tracking-wider font-mono">
              Business Legal Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9295A5]">
                  <Building className="w-3.5 h-3.5 text-[#9466FF]" />
                  <span>Entity Name</span>
                </div>
                <div className="text-sm font-bold text-white">{currentProfile.businessName}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9295A5]">
                  <Briefcase className="w-3.5 h-3.5 text-[#6C8FFF]" />
                  <span>Business Structure</span>
                </div>
                <div className="text-sm font-bold text-white">{currentProfile.businessType}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9295A5]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Operating State</span>
                </div>
                <div className="text-sm font-bold text-white">{currentProfile.locationState}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9295A5]">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Annual Turnover</span>
                </div>
                <div className="text-sm font-bold text-white">{currentProfile.turnoverRange}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9295A5]">
                  <Users className="w-3.5 h-3.5 text-[#9466FF]" />
                  <span>Employee Headcount</span>
                </div>
                <div className="text-sm font-bold text-white">{currentProfile.employeeCount} team members</div>
              </div>

              <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9295A5]">
                  <Globe className="w-3.5 h-3.5 text-[#6C8FFF]" />
                  <span>Foreign Investment (FDI)</span>
                </div>
                <div className="text-sm font-bold text-white">{currentProfile.foreignInvestment}</div>
              </div>
            </div>

            {/* Account Preferences Section */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-[#9295A5] uppercase tracking-wider font-mono">
                Account & Alert Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white">In-App Deadline Alerts</span>
                    <p className="text-[11px] text-[#9295A5]">Simulate automated reminders 7 days prior</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400">
                    Active
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#12151D] border border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white">Interface Theme</span>
                    <p className="text-[11px] text-[#9295A5]">Dark SaaS Aesthetic</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#9466FF]/20 text-[#B69AFF]">
                    Futuristic Dark
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Demo Persona Switcher Section */}
      <div className="bg-[#0D0F15] rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">Switch Demo Business</h3>
            <p className="text-xs text-[#9295A5]">Test how COMPLIO recalculates compliance for different legal structures.</p>
          </div>
          <button
            onClick={resetToDemoDefaults}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9295A5] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoProfiles.map((p) => {
            const isCurrent = p.id === currentProfile.id;
            return (
              <div
                key={p.id}
                onClick={() => switchProfile(p.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isCurrent
                    ? 'bg-[#12151D] border-[#9466FF] shadow-glow'
                    : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs truncate">{p.businessName}</span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-[#9466FF]"></span>
                  )}
                </div>
                <div className="text-[11px] text-[#9295A5]">
                  {p.businessType} • {p.locationState}
                </div>
                <div className="text-[10px] text-gray-400">
                  {p.turnoverRange} | {p.employeeCount} team
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

