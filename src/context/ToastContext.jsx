import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  };

  const borders = {
    success: 'border-emerald-500/40 text-emerald-300 bg-[#091612]/95 shadow-glow-emerald',
    warning: 'border-amber-500/40 text-amber-300 bg-[#161208]/95',
    error: 'border-rose-500/40 text-rose-300 bg-[#160a0d]/95 shadow-glow-rose',
    info: 'border-indigo-500/40 text-indigo-300 bg-[#0c1020]/95',
  };

  const iconColors = {
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-rose-400',
    info: 'text-indigo-400',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || CheckCircle2;
          const borderStyle = borders[toast.type] || borders.success;
          const iconColor = iconColors[toast.type] || 'text-emerald-400';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-toast-in ${borderStyle}`}
            >
              <div className="flex items-center gap-2.5 text-xs font-medium">
                <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: (msg) => console.log('Toast:', msg),
    };
  }
  return context;
}
