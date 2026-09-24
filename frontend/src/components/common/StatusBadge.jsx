import React from 'react';

export function StatusBadge({ status, label }) {
  const displayLabel = label || status;

  let colorClasses = 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]';

  switch (status?.toLowerCase()) {
    case 'active':
    case 'paid in full':
    case 'present':
    case 'completed':
    case 'p':
      colorClasses = 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]';
      break;
    case 'partial':
    case 'late':
    case 'l':
    case 'pending':
      colorClasses = 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]';
      break;
    case 'overdue':
    case 'absent':
    case 'inactive':
    case 'a':
      colorClasses = 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]';
      break;
    case 'excused':
    case 'e':
      colorClasses = 'bg-[#f8fafc] text-[#334155] border-[#cbd5e1]';
      break;
    default:
      colorClasses = 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${colorClasses}`}
    >
      {displayLabel}
    </span>
  );
}
