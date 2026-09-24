import React from 'react';

export function Select({
  label,
  options = [],
  error,
  helperText,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-[#434655]">
          {label} {required && <span className="text-[#dc2626]">*</span>}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <select
          className={`w-full py-2 pl-3 pr-8 bg-white text-[#131b2e] rounded-lg border text-sm transition-all appearance-none cursor-pointer focus:outline-none shadow-sm ${
            error
              ? 'border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/20'
              : 'border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15'
          } ${className}`}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-2.5 pointer-events-none text-[#737686] text-[18px]">
          arrow_drop_down
        </span>
      </div>
      {error && <span className="text-xs text-[#dc2626] font-medium mt-0.5">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-[#737686] mt-0.5">{helperText}</span>
      )}
    </div>
  );
}
