import React from 'react';
import { Link } from '@tanstack/react-router';

export interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block text-2xl font-bold text-indigo-400">
          Application SPA
        </Link>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-100">{title}</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
