import React from 'react';

export function Input({
  label,
  error,
  helperText,
  icon,
  materialIcon,
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
        {materialIcon && (
          <span className="material-symbols-outlined absolute left-3 text-[#737686] text-[18px] pointer-events-none">
            {materialIcon}
          </span>
        )}
        <input
          className={`w-full py-2 bg-white text-[#131b2e] rounded-lg border text-sm transition-all focus:outline-none shadow-sm placeholder:text-[#94a3b8] ${
            materialIcon ? 'pl-9 pr-3' : 'px-3'
          } ${
            error
              ? 'border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/20'
              : 'border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-[#dc2626] font-medium mt-0.5">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-[#737686] mt-0.5">{helperText}</span>
      )}
    </div>
  );
}
