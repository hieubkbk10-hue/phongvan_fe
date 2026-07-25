import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { AppErrorBoundary } from '@/components/common/AppErrorBoundary';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppErrorBoundary>
      <AdminAuthGuard>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex font-sans transition-colors">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            <Header />
            <main className="flex-1 p-4 lg:p-8 overflow-x-hidden w-full max-w-[1600px] mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </AdminAuthGuard>
    </AppErrorBoundary>
  );
}
