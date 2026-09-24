import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  materialIcon,
  loading = false,
  className = '',
  disabled,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus:ring-[#2563eb] shadow-sm active:scale-[0.98]',
    secondary:
      'bg-white text-[#131b2e] border border-[#e2e8f0] hover:bg-[#f8fafc] focus:ring-[#64748b] shadow-sm',
    tertiary:
      'bg-[#059669] text-white hover:bg-[#047857] focus:ring-[#059669] shadow-sm active:scale-[0.98]',
    danger:
      'bg-[#dc2626] text-white hover:bg-[#b91c1c] focus:ring-[#dc2626] shadow-sm active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#434655] hover:text-[#131b2e] hover:bg-[#f2f3ff]',
    soft:
      'bg-[#eaedff] text-[#004ac6] hover:bg-[#dbe1ff] focus:ring-[#2563eb]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">
          progress_activity
        </span>
      ) : materialIcon ? (
        <span className="material-symbols-outlined text-[18px]">{materialIcon}</span>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
