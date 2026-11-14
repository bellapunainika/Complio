import React, { useState, useMemo } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Grid, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { ComplianceItem } from '../types';

export const CalendarPage: React.FC = () => {
  const { complianceList, setSelectedComplianceDetail, toggleTaskStatus } = useCompliance();

  // Active month state - initialized to current date (e.g. November 2026)
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'overdue'>('all');
  const [selectedDayTasks, setSelectedDayTasks] = useState<{ day: number; tasks: ComplianceItem[] } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayTasks(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayTasks(null);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in current month & first day index
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Map compliance items to days in current month
  const itemsByDay = useMemo(() => {
    const map: { [day: number]: ComplianceItem[] } = {};

    complianceList.forEach((item) => {
      // Apply status filter
      if (filterStatus === 'completed' && item.status !== 'completed') return;
      if (filterStatus === 'overdue' && item.status !== 'overdue') return;
      if (filterStatus === 'upcoming' && (item.status === 'completed' || item.status === 'overdue')) return;

      const itemDate = new Date(item.dueDate);
      if (itemDate.getFullYear() === year && itemDate.getMonth() === month) {
        const d = itemDate.getDate();
        if (!map[d]) map[d] = [];
        map[d].push(item);
      }
    });

    return map;
  }, [complianceList, year, month, filterStatus]);

  // List view items sorted
  const sortedListItems = useMemo(() => {
    return [...complianceList]
      .filter(item => {
        if (filterStatus === 'completed' && item.status !== 'completed') return false;
        if (filterStatus === 'overdue' && item.status !== 'overdue') return false;
        if (filterStatus === 'upcoming' && (item.status === 'completed' || item.status === 'overdue')) return false;
        return true;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [complianceList, filterStatus]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-[#9466FF]" />
            <span>Compliance Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9295A5] mt-1">
            Track statutory filing cut-offs, tax timelines, and annual board obligations.
          </p>
        </div>

        {/* View Mode & Filter Toggles */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Filters */}
          <div className="flex items-center p-1 rounded-xl bg-[#12151D] border border-white/10 text-xs">
            {(['all', 'upcoming', 'overdue', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium ${
                  filterStatus === st
                    ? 'bg-[#9466FF] text-white'
                    : 'text-[#9295A5] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Grid vs List */}
          <div className="flex items-center p-1 rounded-xl bg-[#12151D] border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-[#9295A5] hover:text-white'
              }`}
              title="Month Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-[#9295A5] hover:text-white'
              }`}
              title="Chronological List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar View Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Calendar Grid (8 cols on lg) */}
          <div className="lg:col-span-8 bg-[#0D0F15] rounded-2xl border border-white/10 p-5 space-y-4">
            
            {/* Month Navigation Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg bg-[#12151D] border border-white/10 text-[#9295A5] hover:text-white hover:border-white/20 transition-all"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1.5 rounded-lg bg-[#12151D] border border-white/10 text-xs text-[#9295A5] hover:text-white transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg bg-[#12151D] border border-white/10 text-[#9295A5] hover:text-white hover:border-white/20 transition-all"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-[#9295A5] pb-2 border-b border-white/5">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty placeholder cells for offset */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-20 sm:h-24 rounded-xl bg-white/[0.01] border border-white/[0.02]" />
              ))}

              {/* Real month days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const tasks = itemsByDay[day] || [];
                const hasTasks = tasks.length > 0;
                const isSelected = selectedDayTasks?.day === day;
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => {
                      if (hasTasks) {
                        setSelectedDayTasks({ day, tasks });
                      } else {
                        setSelectedDayTasks(null);
                      }
                    }}
                    className={`h-20 sm:h-24 p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#181C26] border-[#9466FF] shadow-glow'
                        : hasTasks
                        ? 'bg-[#12151D] border-white/15 hover:border-[#9466FF]/50'
                        : 'bg-[#0D0F15] border-white/5 hover:bg-[#12151D]'
                    } ${isToday ? 'ring-1 ring-[#6C8FFF]' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isToday ? 'w-5 h-5 rounded-full bg-[#6C8FFF] text-black flex items-center justify-center' : 'text-gray-300'
                      }`}>
                        {day}
                      </span>
                      {hasTasks && (
                        <span className="w-2 h-2 rounded-full bg-[#9466FF]" />
                      )}
                    </div>

                    {/* Task Mini Badges in Day Cell */}
                    <div className="space-y-1 overflow-hidden">
                      {tasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium ${
                            t.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : t.status === 'overdue'
                              ? 'bg-rose-500/20 text-rose-300 font-bold'
                              : 'bg-[#9466FF]/20 text-[#B69AFF]'
                          }`}
                        >
                          {t.name}
                        </div>
                      ))}
                      {tasks.length > 2 && (
                        <div className="text-[9px] text-[#9295A5] pl-1">
                          +{tasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex items-center gap-4 text-xs text-[#9295A5] pt-3 border-t border-white/5 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Due Soon
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Overdue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9466FF]"></span> Standard Filing
              </span>
            </div>

          </div>

          {/* Right Selected Date Task Inspection Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#0D0F15] rounded-2xl border border-white/10 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#9466FF]" />
              <span>
                {selectedDayTasks 
                  ? `Deadlines for ${monthNames[month]} ${selectedDayTasks.day}, ${year}` 
                  : 'Select a Date with Filings'}
              </span>
            </h3>

            {selectedDayTasks ? (
              <div className="space-y-3">
                {selectedDayTasks.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-[#12151D] border border-white/10 space-y-2 hover:border-[#9466FF]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#9295A5]">
                        {task.category}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        task.status === 'completed' ? 'text-emerald-400' : task.status === 'overdue' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {task.name}
                    </h4>

                    <p className="text-[11px] text-[#9295A5]">
                      {task.responsibleAuthority}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <button
                        onClick={() => setSelectedComplianceDetail(task)}
                        className="text-xs text-[#B69AFF] hover:underline"
                      >
                        Inspect Details →
                      </button>

                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                      >
                        {task.status === 'completed' ? 'Undo' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-[#12151D] border border-white/5 space-y-2">
                <CalendarIcon className="w-8 h-8 text-[#9295A5] mx-auto opacity-50" />
                <p className="text-xs text-[#9295A5]">
                  Click on any day in the calendar grid marked with a dot to view scheduled obligations.
                </p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Alternative Chronological List View */
        <div className="bg-[#0D0F15] rounded-2xl border border-white/10 p-5 space-y-4">
          <div className="space-y-3">
            {sortedListItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#12151D] border border-white/5 hover:border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div 
                  className="space-y-1 cursor-pointer flex-1"
                  onClick={() => setSelectedComplianceDetail(item)}
                >
                  <div className="flex items-center gap-2 text-xs text-[#9295A5]">
                    <span className="font-mono text-white font-bold">{item.dueDate}</span>
                    <span>•</span>
                    <span>{item.responsibleAuthority}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white hover:text-[#B69AFF] transition-colors">
                    {item.name}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                    item.status === 'completed' 
                      ? 'bg-emerald-500/15 text-emerald-400' 
                      : item.status === 'overdue' 
                      ? 'bg-rose-500/15 text-rose-400' 
                      : 'bg-amber-500/15 text-amber-300'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>

                  <button
                    onClick={() => setSelectedComplianceDetail(item)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

