import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/users')({
  component: UsersPageStub,
});

function UsersPageStub() {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      <h1 className="text-xl font-bold font-sans">Quản lý Người dùng</h1>
    </div>
  );
}
