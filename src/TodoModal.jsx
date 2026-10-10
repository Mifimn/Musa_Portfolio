import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Bell, 
  Clock, 
  Play
} from 'lucide-react';

const TodoModal = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('mifimn_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [taskText, setTaskText] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notifPermission, setNotifPermission] = useState('default');

  // Sync tasks with localStorage
  useEffect(() => {
    localStorage.setItem('mifimn_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Read permission status
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, [isOpen]);

  // Mobile-compatible notification trigger
  const triggerNotification = async (title, body) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body,
          icon: '/logo.png',
          badge: '/logo.png',
          vibrate: [200, 100, 200],
          tag: 'mifimn-task-reminder',
        });
      } else {
        new Notification(title, { body, icon: '/logo.png' });
      }
    } catch (err) {
      console.error('Notification dispatch failed:', err);
    }
  };

  // Clock checker (runs every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (notifPermission !== 'granted') return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      tasks.forEach((t) => {
        if (!t.completed && t.time && t.time === currentTimeString && !t.notified) {
          triggerNotification('Mifimn Reminder', `⏰ Time for: ${t.text}`);

          setTasks((prev) =>
            prev.map((item) => (item.id === t.id ? { ...item, notified: true } : item))
          );
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [tasks, notifPermission]);

  const requestNotification = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotifPermission(res);
      if (res === 'granted') {
        triggerNotification('Notifications Enabled', 'Mifimn reminders are now active on your device.');
      }
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      time: taskTime,
      priority,
      completed: false,
      notified: false,
      createdAt: new Date().toLocaleDateString(),
    };

    setTasks([newTask, ...tasks]);
    setTaskText('');
    setTaskTime('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-neutral-950 border border-neutral-800 w-full max-w-lg p-6 rounded-lg text-white shadow-2xl relative max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-neutral-800 shrink-0">
            <div>
              <span className="text-green-500 text-[10px] uppercase tracking-widest">// DAILY_OPERATIONS</span>
              <h2 className="text-xl font-bold font-sans tracking-tight">Task Manager</h2>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-white p-1">
              <X size={20} />
            </button>
          </div>

          {/* Permission / Test Alert Bar */}
          <div className="my-3 p-2 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-between text-xs">
            {notifPermission !== 'granted' ? (
              <>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Bell size={14} className="text-yellow-500" />
                  <span>Enable device notifications</span>
                </div>
                <button 
                  onClick={requestNotification}
                  className="bg-white text-black px-2.5 py-1 text-[10px] font-bold rounded hover:bg-neutral-200"
                >
                  ALLOW
                </button>
              </>
            ) : (
              <>
                <span className="text-green-400 text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Alerts Active
                </span>
                <button 
                  onClick={() => triggerNotification('Test Alert', 'Device notifications are working correctly.')}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 text-[10px] rounded flex items-center gap-1"
                >
                  <Play size={10} /> Test Alert
                </button>
              </>
            )}
          </div>

          {/* Form */}
          <form onSubmit={addTask} className="mb-4 flex flex-col gap-2 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New daily task or reminder..."
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                className="flex-1 bg-black border border-neutral-800 text-xs p-2.5 rounded focus:outline-none focus:border-white text-neutral-200"
              />
              <button 
                type="submit" 
                className="bg-white text-black font-bold px-4 text-xs rounded hover:bg-neutral-200 flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex gap-2 items-center text-xs">
              <div className="flex items-center gap-1 bg-black border border-neutral-800 px-2 py-1 rounded">
                <Clock size={12} className="text-neutral-500" />
                <input 
                  type="time" 
                  value={taskTime} 
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="bg-transparent text-neutral-300 text-[11px] focus:outline-none" 
                />
              </div>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-black border border-neutral-800 text-neutral-300 text-[11px] px-2 py-1 rounded focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </form>

          {/* List */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-neutral-600 text-xs border border-dashed border-neutral-900 rounded">
                No active tasks. Add your daily routine above.
              </div>
            ) : (
              tasks.map((t) => (
                <div 
                  key={t.id} 
                  className={`p-3 bg-neutral-900/60 border rounded flex items-center justify-between text-xs transition-colors ${
                    t.completed ? 'border-neutral-900 opacity-40' : 'border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={() => toggleTask(t.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        t.completed ? 'bg-white border-white text-black' : 'border-neutral-600'
                      }`}
                    >
                      {t.completed && <Check size={10} />}
                    </button>
                    <div className="truncate">
                      <p className={`truncate ${t.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                        {t.text}
                      </p>
                      {t.time && (
                        <span className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {t.time}
                        </span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteTask(t.id)} 
                    className="text-neutral-600 hover:text-red-400 p-1 shrink-0 ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TodoModal;
