import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> { 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; 
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border whitespace-nowrap cursor-pointer';
  
  const variants = {
    default: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700',
    success: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/25',
    warning: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/25',
    danger: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/25',
    info: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/25',
  };
  
  return <div className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
