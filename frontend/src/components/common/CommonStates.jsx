import React from 'react';

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="material-symbols-outlined absolute left-3 text-[#737686] pointer-events-none text-[18px]">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-white text-[#131b2e] text-sm rounded-lg border border-[#cbd5e1] focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 transition-all placeholder:text-[#94a3b8] shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 text-[#737686] hover:text-[#131b2e] p-0.5"
          title="Clear search"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="px-4 py-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#434655]">
      <div>
        Showing <strong className="text-[#131b2e]">{start} to {end}</strong> of{' '}
        <strong className="text-[#131b2e]">{totalItems}</strong> records
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 py-1 rounded bg-white text-[#434655] hover:text-[#131b2e] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs font-semibold"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-colors shadow-xs ${
              currentPage === page
                ? 'bg-[#2563eb] text-white'
                : 'bg-white text-[#131b2e] border border-[#e2e8f0] hover:bg-[#f1f5f9]'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1 rounded bg-white text-[#434655] hover:text-[#131b2e] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'No records found',
  description = 'There are no items matching your criteria.',
  actionLabel,
  onAction,
  icon = 'search_off',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl border border-[#e2e8f0]">
      <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#737686] mb-3">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <h4 className="font-headline text-lg font-semibold text-[#131b2e] mb-1">{title}</h4>
      <p className="text-sm text-[#434655] max-w-md mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading school data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-10 h-10 border-3 border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin mb-3"></div>
      <p className="text-sm text-[#434655] font-medium">{message}</p>
    </div>
  );
}
