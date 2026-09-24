import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/20'
                : toast.type === 'info'
                ? 'bg-[#eaedff] text-[#1d3989] border-[#2563eb]/20'
                : 'bg-[#d1fae5] text-[#065f46] border-[#059669]/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {toast.type === 'error'
                  ? 'error'
                  : toast.type === 'info'
                  ? 'info'
                  : 'check_circle'}
              </span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-70 hover:opacity-100 p-0.5 rounded"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
