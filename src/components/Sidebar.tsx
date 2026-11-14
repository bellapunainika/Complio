import React, { useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  FileSpreadsheet,
  Layers,
  Calendar as CalendarIcon,
  Bell,
  FolderArchive,
  User,
  Info,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  RotateCcw,
  Building,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    currentProfile, 
    notifications, 
    resetToDemoDefaults,
    switchProfile,
    demoProfiles
  } = useCompliance();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Smart' },
    { id: 'tasks', label: 'My Compliance', icon: CheckSquare },
    { id: 'gst-automation', label: 'GST Automation', icon: FileSpreadsheet, badge: 'Studio' },
    { id: 'document-studio', label: 'Document Studio', icon: Layers },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell, badgeCount: unreadCount },
    { id: 'document-vault', label: 'Document Vault', icon: FolderArchive },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 bg-[#0A0C11] border-r border-white/10 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Brand */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setActiveView('landing')} 
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 min-w-10 rounded-xl bg-gradient-to-br from-[#9466FF] to-[#6C8FFF] flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-bold text-lg text-white font-display flex items-center gap-1.5">
                  COMPLIO
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9466FF]"></span>
                </div>
                <div className="text-[10px] text-[#9295A5] uppercase tracking-wider font-mono">
                  Compliance & Automation
                </div>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-[#9295A5] hover:text-white hover:bg-white/5 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Demo Switcher Quick Pill */}
        {!isCollapsed && (
          <div className="mt-4 relative">
            <button
              onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#12151D] border border-white/10 hover:border-[#9466FF]/40 text-left transition-all text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <Building className="w-3.5 h-3.5 text-[#9466FF] shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white truncate">{currentProfile.businessName}</div>
                  <div className="text-[10px] text-[#9295A5]">{currentProfile.businessType}</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9295A5] shrink-0" />
            </button>

            {/* Switcher dropdown */}
            {showProfileSwitcher && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#12151D] border border-white/15 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] uppercase font-mono text-[#9295A5] px-2 py-1">
                  Switch Demo Business:
                </div>
                {demoProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProfile(p.id);
                      setShowProfileSwitcher(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      p.id === currentProfile.id
                        ? 'bg-[#9466FF]/20 text-[#B69AFF] font-medium'
                        : 'hover:bg-white/5 text-[#9295A5] hover:text-white'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{p.businessName}</div>
                      <div className="text-[10px] opacity-75">{p.businessType} • {p.locationState}</div>
                    </div>
                    {p.id === currentProfile.id && (
                      <span className="w-2 h-2 rounded-full bg-[#9466FF] shrink-0"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation List */}
      <div className="px-3 py-3 flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setShowProfileSwitcher(false);
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#9466FF]/20 to-[#6C8FFF]/10 text-white border border-[#9466FF]/30 shadow-glow'
                  : 'text-[#9295A5] hover:text-[#F4F3FA] hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#B69AFF] scale-110' : 'group-hover:scale-105'}`} />
              
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {/* Badges */}
              {!isCollapsed && item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#9466FF]/25 text-[#B69AFF] flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  {item.badge}
                </span>
              )}

              {!isCollapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {item.badgeCount}
                </span>
              )}

              {/* Collapsed dot badge */}
              {isCollapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <button
          onClick={resetToDemoDefaults}
          title="Reset demo data"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#9295A5] hover:text-white hover:bg-white/5 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Reset Demo Data</span>}
        </button>

        <button
          onClick={() => setActiveView('landing')}
          title="Exit to Landing"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#9295A5] hover:text-rose-400 hover:bg-rose-500/10 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Exit Demo / Home</span>}
        </button>

        <div 
          onClick={() => setActiveView('profile')}
          className={`flex items-center gap-2.5 p-2 rounded-xl bg-[#12151D] border border-white/10 hover:border-[#9466FF]/40 cursor-pointer transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9466FF] to-[#6C8FFF] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
            {currentProfile.avatarInitials}
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">{currentProfile.name}</div>
              <div className="text-[10px] text-[#9295A5] truncate">{currentProfile.businessName}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
