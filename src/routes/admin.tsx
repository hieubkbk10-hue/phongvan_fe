import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { AppErrorBoundary } from '@/components/common/AppErrorBoundary';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // UI: State quản lý menu hiển thị trên thiết bị di động tuân thủ is[Feature][State]
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // UI: Khởi tạo giao diện sáng/tối từ localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <AppErrorBoundary>
      <AdminAuthGuard>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex font-sans transition-colors">
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            mobileMenuOpen={isMobileMenuOpen}
            setMobileMenuOpen={setIsMobileMenuOpen}
          />
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            <Header
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              setMobileMenuOpen={setIsMobileMenuOpen}
            />
            <main className="flex-1 p-4 lg:p-8 overflow-x-hidden w-full max-w-[1600px] mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </AdminAuthGuard>
    </AppErrorBoundary>
  );
}
