import React, { useEffect } from 'react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full ${maxWidth} bg-white rounded-xl shadow-2xl border border-[#e2e8f0] overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-[#faf8ff]">
            <h3 className="font-headline text-xl font-semibold text-[#131b2e]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#737686] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
