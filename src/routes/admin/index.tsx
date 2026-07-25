import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
  component: AdminIndexComponent,
});

function AdminIndexComponent() {
  return <Navigate to="/admin/dashboard" replace />;
}
