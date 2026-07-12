import React from 'react';

export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full overflow-auto rounded-md border border-zinc-200 dark:border-zinc-800 ${className}`}>
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <thead className={`border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-900/50 ${className}`}>{children}</thead>;
}

export function TableBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>;
}

export function TableRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <tr className={`border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 data-[state=selected]:bg-zinc-100 dark:data-[state=selected]:bg-zinc-800 ${className}`}>{children}</tr>;
}

export function TableHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400 [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</th>;
}

export function TableCell({ children, className = '', colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;
}
