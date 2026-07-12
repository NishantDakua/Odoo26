import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { 
  label?: string; 
  error?: string; 
  options: {value: string, label: string}[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
        <select 
          ref={ref} 
          className={`flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`} 
          {...props}
        >
          {options.map(opt => <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{opt.label}</option>)}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
