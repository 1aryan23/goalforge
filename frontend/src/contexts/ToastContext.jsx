import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };
  const colorMap = {
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/50 bg-red-500/10 text-red-300',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
    warning: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border glass-card shadow-xl animate-fade-in ${colorMap[t.type]}`}
        >
          <span className="text-lg font-bold">{iconMap[t.type]}</span>
          <p className="text-sm font-medium flex-1">{t.message}</p>
          <button
            onClick={() => onRemove(t.id)}
            className="text-current opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be within ToastProvider');
  return ctx;
}
