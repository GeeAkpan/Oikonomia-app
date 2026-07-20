import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  X,
  Clock,
  NotebookTabs,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Task, CalendarEvent } from '../types';

interface TasksCalendarViewProps {
  tasks: Task[];
  calendarEvents: CalendarEvent[];
  onToggleTask: (id: string) => void;
  onAddTask: (taskData: any) => void;
  role: string;
}

export default function TasksCalendarView({
  tasks,
  calendarEvents,
  onToggleTask,
  onAddTask,
  role
}: TasksCalendarViewProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [taskCategory, setTaskCategory] = useState('Operations');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle,
      dueDate: taskDueDate || new Date().toISOString().split('T')[0],
      priority: taskPriority,
      category: taskCategory
    });

    setTaskTitle('');
    setShowAddTask(false);
  };

  // Generate July 2026 Calendar (Starts on Wednesday, 31 Days)
  const daysInMonth = 31;
  const startOffset = 3; // Wednesday starts July 1st (0: Sun, 1: Mon, 2: Tue, 3: Wed)
  const calendarCells = [];

  // Empty cells for offset
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Match event to day
  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
    return calendarEvents.filter((ev) => ev.date === dateStr);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">Operational Calendar & Tasks</h2>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Coordinate upcoming payouts, compliance calls, maturity audits, and corporate reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* July 2026 Calendar Grid */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold font-mono text-zinc-300 uppercase">
              July 2026 Grid View
            </span>
            <span className="text-xs font-mono text-zinc-500">Wednesday start (31 Days)</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-zinc-500 font-semibold py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === 20; // Matches system current time July 20, 2026

              return (
                <div
                  key={idx}
                  className={`min-h-20 bg-zinc-950 rounded-xl border p-2 flex flex-col justify-between transition-colors relative ${
                    day ? 'border-zinc-850 hover:border-zinc-700 cursor-pointer' : 'border-transparent bg-transparent'
                  } ${isToday ? 'border-emerald-500 bg-emerald-950/10' : ''}`}
                >
                  {day && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold font-mono ${isToday ? 'text-emerald-400' : 'text-zinc-400'}`}>
                          {day}
                        </span>
                        {isToday && (
                          <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                        )}
                      </div>

                      {/* Display small color event dots/labels */}
                      <div className="space-y-1 mt-1">
                        {dayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(ev);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[8px] truncate font-bold uppercase tracking-wider ${
                              ev.type === 'maturity'
                                ? 'bg-red-500/15 text-red-400 border border-red-500/10'
                                : ev.type === 'repayment'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10'
                                : ev.type === 'meeting'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/10'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                            title={ev.title}
                          >
                            {ev.title.substring(0, 10)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Items List */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-zinc-300 uppercase tracking-wider">
              Weekly Operations checklist
            </h3>
            {['Owner', 'Admin', 'Accountant', 'InvestmentManager'].includes(role) && (
              <button
                onClick={() => setShowAddTask(true)}
                className="p-1 hover:bg-zinc-800 rounded text-emerald-500 hover:text-emerald-400 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-850 cursor-pointer hover:border-zinc-750 transition-colors"
              >
                <div>
                  <CheckCircle2
                    size={18}
                    className={task.completed ? 'text-emerald-500' : 'text-zinc-600'}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-semibold text-zinc-200 truncate ${
                      task.completed ? 'line-through text-zinc-500' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    Due: {task.dueDate} • {task.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h3 className="text-lg font-bold text-white font-sans">Create Operational Task</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="p-1 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Futures portfolio leverage drawdowns"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Task Category</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                >
                  <option value="Risk Management">Risk Management</option>
                  <option value="Investor Relations">Investor Relations</option>
                  <option value="Finance">Finance</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Operations">Operations</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="flex justify-end gap-3.5 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-900/20 transition-colors cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Event details dialog */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                Calendar Event Audit Card
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 hover:bg-zinc-850 rounded text-zinc-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span
                  className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                    selectedEvent.type === 'maturity'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/10'
                      : selectedEvent.type === 'repayment'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/10'
                  }`}
                >
                  {selectedEvent.type}
                </span>
                <h4 className="text-base font-bold text-white font-sans">{selectedEvent.title}</h4>
                <span className="text-xs text-zinc-500 font-mono block">Target Date: {selectedEvent.date}</span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-sans bg-zinc-900/50 p-3 rounded-lg border border-zinc-850">
                "{selectedEvent.description}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
