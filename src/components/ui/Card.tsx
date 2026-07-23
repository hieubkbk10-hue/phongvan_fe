import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, glass = true, children, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-slate-800/80 p-6 transition-all duration-200 shadow-xl',
          glass ? 'bg-slate-900/60 backdrop-blur-md' : 'bg-slate-900',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
