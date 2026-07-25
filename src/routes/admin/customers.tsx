import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/customers')({
  component: CustomersPageStub,
});

function CustomersPageStub() {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      <h1 className="text-xl font-bold">Quản lý Khách hàng</h1>
    </div>
  );
}
