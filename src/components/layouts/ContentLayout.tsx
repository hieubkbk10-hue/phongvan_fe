import React from 'react';

export interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const ContentLayout: React.FC<ContentLayoutProps> = ({ title, children }) => {
  return (
    <div className="py-6 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-slate-100">{title}</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
    </div>
  );
};
