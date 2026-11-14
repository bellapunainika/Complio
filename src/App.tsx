import React from 'react';
import { ComplianceProvider, useCompliance } from './context/ComplianceContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { MyCompliancePage } from './pages/MyCompliancePage';
import { GSTAutomationPage } from './pages/GSTAutomationPage';
import { DocumentStudioPage } from './pages/DocumentStudioPage';
import { CalendarPage } from './pages/CalendarPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { DocumentVaultPage } from './pages/DocumentVaultPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { Sidebar } from './components/Sidebar';
import { ComplianceDetailDrawer } from './components/ComplianceDetailDrawer';
import { Bell, Building, Bot, FileSpreadsheet, Layers } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, currentProfile, notifications } = useCompliance();

  // Full-page views without sidebar
  if (activeView === 'landing') {
    return (
      <>
        <LandingPage />
        <ComplianceDetailDrawer />
      </>
    );
  }

  if (activeView === 'login') {
    return (
      <>
        <LoginPage />
        <ComplianceDetailDrawer />
      </>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderActivePage = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'tasks':
        return <MyCompliancePage />;
      case 'gst-automation':
        return <GSTAutomationPage />;
      case 'document-studio':
        return <DocumentStudioPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'document-vault':
        return <DocumentVaultPage />;
      case 'profile':
        return <ProfilePage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage />;
    }
  };

  const getPageTitle = (view: string) => {
    switch (view) {
      case 'dashboard': return 'Dashboard Overview';
      case 'ai-assistant': return 'AI Assistant';
      case 'tasks': return 'My Compliance Checklist';
      case 'gst-automation': return 'GST Automation Studio';
      case 'document-studio': return 'Document Studio';
      case 'calendar': return 'Compliance Calendar';
      case 'notifications': return 'Notification Centre';
      case 'document-vault': return 'Document Vault';
      case 'profile': return 'Founder & Business Profile';
      case 'about': return 'About COMPLIO';
      default: return 'Overview';
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F4F3FA] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area with sidebar offset */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ml-20 md:ml-64">
        
        {/* Top App Header */}
        <header className="sticky top-0 z-20 h-16 bg-[#08090D]/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 flex items-center justify-between">
          
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#9295A5] hidden sm:inline">
              COMPLIO //
            </span>
            <span className="text-sm font-bold text-white capitalize font-display">
              {getPageTitle(activeView)}
            </span>
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#9295A5]">
              <Building className="w-3.5 h-3.5 text-[#9466FF]" />
              <span className="text-white font-medium">{currentProfile.businessName}</span>
              <span className="text-[10px] text-gray-400">({currentProfile.businessType})</span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Quick GST shortcut */}
            {activeView !== 'gst-automation' && (
              <button
                onClick={() => setActiveView('gst-automation')}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#6C8FFF]" />
                <span>GST Studio</span>
              </button>
            )}

            {/* Quick Ask AI shortcut */}
            {activeView !== 'ai-assistant' && (
              <button
                onClick={() => setActiveView('ai-assistant')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9466FF]/15 hover:bg-[#9466FF]/25 border border-[#9466FF]/30 text-xs font-semibold text-[#B69AFF] transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setActiveView('notifications')}
              className="relative p-2 rounded-xl bg-[#12151D] hover:bg-white/10 border border-white/10 text-[#9295A5] hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile avatar */}
            <div 
              onClick={() => setActiveView('profile')}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
              title="View Profile"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9466FF] to-[#6C8FFF] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {currentProfile.avatarInitials}
              </div>
            </div>
          </div>

        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        {/* Global Slide-over Detail Drawer */}
        <ComplianceDetailDrawer />

      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ComplianceProvider>
      <AppContent />
    </ComplianceProvider>
  );
};

export default App;
