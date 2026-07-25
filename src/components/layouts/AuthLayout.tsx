import React from 'react';
import { Link } from '@tanstack/react-router';
import { Store } from 'lucide-react';

export interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2.5 text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            <Store size={22} />
          </div>
          <span>Phỏng Vấn CMS</span>
        </Link>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
