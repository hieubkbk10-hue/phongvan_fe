import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Home, Users, Settings, LogOut, Menu, X, Radio } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { Button } from '@/components/ui';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      activeProps={{ className: 'bg-indigo-600/20 text-indigo-400 font-semibold' }}
      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // UI: Quản lý trạng thái mở/đóng sidebar trên thiết bị di động tuân thủ is[Feature][State]
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // QUYỀN: Xử lý đăng xuất tài khoản
  const handleLogout = () => {
    logout();
    navigate({ to: '/auth/login' });
  };

  const navigation = [
    { label: 'Dashboard', to: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Users', to: '/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Realtime Monitor', to: '/realtime', icon: <Radio className="w-4 h-4" /> },
    { label: 'Settings', to: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/50 p-4 space-y-6">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
            PV
          </div>
          <span className="font-bold text-lg text-slate-100">Application</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <SidebarItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between px-2">
          <div className="text-xs">
            <p className="font-medium text-slate-200">{user?.name || 'Guest User'}</p>
            <p className="text-slate-500 truncate max-w-[120px]">
              {user?.email || 'guest@example.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-slate-100"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Mobile Bar */}
        <header className="md:hidden flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <span className="font-bold text-slate-100">Application</span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isSidebarOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <SidebarItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
            ))}
          </div>
        )}

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
