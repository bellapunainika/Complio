import React, { useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    complianceList, 
    setSelectedComplianceDetail 
  } = useCompliance();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Find simulated upcoming deadline within 7 days
  const urgentItems = complianceList.filter(
    item => item.status !== 'completed' && item.dueDaysRemaining >= 0 && item.dueDaysRemaining <= 7
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-[#9466FF]" />
            <span>Notification Centre</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9295A5] mt-1">
            Simulated in-app reminder triggers and compliance milestone alerts.
          </p>
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#B69AFF] border border-white/10 transition-colors flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* In-app Reminder Simulation Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#12151D] via-[#0D0F15] to-[#181C26] border border-[#9466FF]/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#B69AFF]">
            <Clock className="w-4 h-4 text-[#9466FF]" />
            <span>Active Automated Reminder Simulation</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono">
            Demo Simulator Active
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          COMPLIO calculates time-to-deadline thresholds continuously. In production, these triggers dispatch email/SMS reminders 7 days prior to cut-off dates.
        </p>

        {urgentItems.length > 0 ? (
          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-xs text-amber-200/90 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Simulated Trigger:</strong> {urgentItems[0].name} is due in {urgentItems[0].dueDaysRemaining} days!
              </span>
            </span>
            <button
              onClick={() => setSelectedComplianceDetail(urgentItems[0])}
              className="text-xs font-bold text-amber-300 hover:underline shrink-0 ml-2"
            >
              Inspect Filing
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-[#9295A5]">
            No imminent filings within the 7-day reminder threshold.
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-t-xl font-medium transition-colors border-b-2 ${
            filter === 'all'
              ? 'border-[#9466FF] text-white bg-white/[0.03]'
              : 'border-transparent text-[#9295A5] hover:text-white'
          }`}
        >
          All Notifications ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-t-xl font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'border-[#9466FF] text-white bg-white/[0.03]'
              : 'border-transparent text-[#9295A5] hover:text-white'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filteredNotifs.map((n) => {
          const matchedItem = complianceList.find(c => c.id === n.complianceId);

          return (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                !n.read
                  ? 'bg-[#12151D] border-[#9466FF]/30 shadow-glow'
                  : 'bg-[#0D0F15] border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl mt-0.5 ${
                  n.type === 'danger'
                    ? 'bg-rose-500/15 text-rose-400'
                    : n.type === 'warning'
                    ? 'bg-amber-500/15 text-amber-400'
                    : n.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-[#9466FF]/15 text-[#B69AFF]'
                }`}>
                  {n.type === 'danger' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : n.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : n.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${!n.read ? 'text-white' : 'text-gray-300'}`}>
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9466FF]"></span>
                    )}
                  </div>

                  <p className="text-xs text-[#9295A5] leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-[#9295A5]">
                    <span>{n.timestamp}</span>
                    {matchedItem && (
                      <button
                        onClick={() => setSelectedComplianceDetail(matchedItem)}
                        className="text-[#B69AFF] hover:underline font-semibold"
                      >
                        View Compliance Task →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markNotificationRead(n.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#9295A5] hover:text-white hover:bg-white/5 transition-colors shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          );
        })}

        {filteredNotifs.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0D0F15] border border-white/5 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No unread notifications</h3>
            <p className="text-xs text-[#9295A5]">You're completely caught up with all compliance alerts.</p>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-[#9295A5]">
        <strong>Demonstration Note:</strong> All notifications and simulated deadlines operate strictly within your local browser sandbox. No real external emails or SMS are dispatched.
      </div>

    </div>
  );
};

