import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/media')({
  component: MediaPageStub,
});

function MediaPageStub() {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      <h1 className="text-xl font-bold">Thư viện Media</h1>
    </div>
  );
}
