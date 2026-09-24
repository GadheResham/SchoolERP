import React from 'react';

export function KpiCard({
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'positive', // positive, neutral, warning, danger
  progress,
  footerLeft,
  footerRight,
  onClick,
}) {
  const badgeClasses = {
    positive: 'bg-[#ecfdf5] text-[#047857]',
    neutral: 'bg-[#eaedff] text-[#004ac6]',
    warning: 'bg-[#fffbeb] text-[#92400e]',
    danger: 'bg-[#fef2f2] text-[#b91c1c]',
  };

  return (
    <div
      onClick={onClick}
      className={`flex flex-col justify-between p-5 bg-white rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-wider text-[#434655] font-bold">
          {title}
        </span>
        {badgeText && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${
              badgeClasses[badgeType] || badgeClasses.neutral
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="my-3">
        <div className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight tabular-nums">
          {value}
        </div>
        {subtitle && <div className="text-xs text-[#434655] mt-1">{subtitle}</div>}
        {progress !== undefined && (
          <div className="w-full bg-[#eaedff] h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                badgeType === 'positive'
                  ? 'bg-[#059669]'
                  : badgeType === 'danger'
                  ? 'bg-[#dc2626]'
                  : 'bg-[#2563eb]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>

      {(footerLeft || footerRight) && (
        <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
          {footerLeft && <span className="text-[#434655]">{footerLeft}</span>}
          {footerRight && (
            <span className="font-semibold text-[#131b2e] tabular-nums">{footerRight}</span>
          )}
        </div>
      )}
    </div>
  );
}
