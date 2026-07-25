import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { UserCheck, Shield, Mail, Calendar, LogOut, Key } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createFileRoute('/admin/users')({
  component: UsersPage,
});

function UsersPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/auth/login' });
  };

  const displayName = user?.name || 'Administrator';
  const displayEmail = user?.email || 'admin@example.com';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Title Bar */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <UserCheck className="text-blue-600 dark:text-blue-400" size={26} />
          <span>Quản lý Tài khoản Admin & Người dùng</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Thông tin tài khoản quản trị viên truy cập hệ thống CMS
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shrink-0">
            {initials}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{displayName}</h2>
              <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-xs rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                <Shield size={12} /> Super Admin
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail size={14} /> {displayEmail}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Loại tài khoản</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Key size={16} className="text-amber-500" /> System Administrator
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Thời gian kích hoạt</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" /> Bảng Users Backend (Apiato)
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <LogOut size={18} />
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>
      </div>
    </div>
  );
}
