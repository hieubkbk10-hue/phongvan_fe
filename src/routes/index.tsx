import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ContentLayout } from '@/components/layouts/ContentLayout';
import { Card } from '@/components/ui/Card';
import { SoketiStatusCard } from '@/features/real-time/components/SoketiStatusCard';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createFileRoute('/')({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <DashboardLayout>
      <ContentLayout title="Dashboard">
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-100">
              Welcome back, {user?.name || 'Developer'}!
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Core architecture initialized with TanStack Router, TanStack Query, Zustand, Laravel Echo & Soketi.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card glass={false}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Authentication Status</p>
              <p className="text-lg font-bold text-slate-100 mt-1">
                {isAuthenticated ? 'Authenticated' : 'Unauthenticated'}
              </p>
            </Card>

            <Card glass={false}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Backend API Target</p>
              <p className="text-lg font-bold text-slate-100 mt-1 truncate">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}
              </p>
            </Card>

            <Card glass={false}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Soketi WebSocket Host</p>
              <p className="text-lg font-bold text-slate-100 mt-1">
                {import.meta.env.VITE_SOKETI_HOST || '127.0.0.1'}:{import.meta.env.VITE_SOKETI_PORT || '6001'}
              </p>
            </Card>
          </div>

          {/* Real-time Socket Monitor Component */}
          <div>
            <SoketiStatusCard />
          </div>
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
}
