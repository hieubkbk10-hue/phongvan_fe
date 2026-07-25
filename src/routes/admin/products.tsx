import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/products')({
  component: ProductsPageStub,
});

function ProductsPageStub() {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      <h1 className="text-xl font-bold">Quản lý Sản phẩm</h1>
    </div>
  );
}
