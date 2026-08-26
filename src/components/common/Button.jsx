import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] select-none';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white shadow-tactile-primary border-t border-white/20 border-x border-b border-primary-700 font-semibold',
    secondary: 'bg-canvas-raised hover:bg-canvas-highlight active:bg-canvas-panel text-slate-200 border border-slate-700/80 hover:border-slate-600 shadow-tactile',
    danger: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-tactile border-t border-white/20 border-x border-b border-rose-800 font-semibold',
    success: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-tactile border-t border-white/20 border-x border-b border-emerald-800 font-semibold',
    warning: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-tactile border-t border-white/40 border-x border-b border-amber-600 font-bold',
    outline: 'bg-canvas-subtle/60 hover:bg-primary-950/40 text-primary-300 hover:text-primary-200 border border-primary-500/40 hover:border-primary-400/60 shadow-tactile',
    ghost: 'bg-transparent hover:bg-slate-800/70 text-slate-300 hover:text-white',
    subtle: 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-sm font-semibold gap-2.5',
    xl: 'px-7 py-3.5 text-base font-semibold gap-3',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' || size === 'xl' ? 'w-5 h-5' : 'w-4 h-4'} />}
          {children}
        </>
      )}
    </button>
  );
}

