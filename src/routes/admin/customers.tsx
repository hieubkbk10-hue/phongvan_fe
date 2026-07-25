import { useState, useEffect, useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Users, Plus, Search, Filter, Edit3, Trash2, RotateCcw, Phone, MapPin, Mail, Loader2, UserCheck, UserX } from 'lucide-react';
import type { Customer, CreateCustomerInput } from '@/features/customers/types';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, restoreCustomer } from '@/features/customers/api/customersApi';
import { CustomerModal } from '@/features/customers/components/CustomerModal';

export const Route = createFileRoute('/admin/customers')({
  component: CustomersPage,
});

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [trashedTab, setTrashedTab] = useState<'active' | 'trashed'>('active');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCustomers({
        page,
        limit: 10,
        search: search || undefined,
        trashed: trashedTab === 'trashed' ? 'only' : undefined,
      });
      setCustomers(result.data);
      if (result.meta?.pagination) {
        setTotalPages(result.meta.pagination.total_pages);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách khách hàng:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, trashedTab]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCreateOrUpdate = async (data: CreateCustomerInput) => {
    try {
      setSubmitting(true);
      if (editingCustomer) {
        await updateCustomer({ id: editingCustomer.id, ...data });
      } else {
        await createCustomer(data);
      }
      setModalOpen(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Thao tác thất bại. Vui lòng kiểm tra lại số điện thoại trùng.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa mềm khách hàng "${name}"?`)) return;
    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Xóa khách hàng thất bại.');
    }
  };

  const handleRestore = async (id: string, name: string) => {
    if (!confirm(`Bạn có muốn khôi phục khách hàng "${name}"?`)) return;
    try {
      await restoreCustomer(id);
      fetchCustomers();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Khôi phục khách hàng thất bại.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Users className="text-emerald-600 dark:text-emerald-400" size={26} />
            <span>Quản lý Khách hàng</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lưu trữ thông tin khách hàng, số điện thoại E.164, tính năng xóa mềm và khôi phục
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCustomer(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      {/* Tabs & Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-4">
        {/* Active vs Trashed Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            onClick={() => {
              setTrashedTab('active');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              trashedTab === 'active'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck size={16} />
            <span>Đang hoạt động</span>
          </button>

          <button
            onClick={() => {
              setTrashedTab('trashed');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              trashedTab === 'trashed'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserX size={16} />
            <span>Đã xóa mềm</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo số điện thoại (E.164) hoặc tên khách hàng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 size={32} className="animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Đang tải danh sách khách hàng...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Users size={48} className="mx-auto opacity-30 mb-2" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Không tìm thấy khách hàng nào</p>
            <p className="text-xs text-slate-500 mt-1">
              {trashedTab === 'trashed' ? 'Không có khách hàng nào trong thùng rác' : 'Thêm khách hàng mới để bắt đầu'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Khách hàng</th>
                  <th className="px-6 py-3.5">Số điện thoại (E.164)</th>
                  <th className="px-6 py-3.5">Địa chỉ</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0">
                          {customer.name[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{customer.name}</p>
                          {customer.email && (
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {customer.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold">
                        <Phone size={12} className="text-emerald-500" />
                        {customer.phone}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <p className="truncate max-w-xs flex items-center gap-1.5 text-xs">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span>{customer.address}</span>
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {trashedTab === 'active' ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingCustomer(customer);
                                setModalOpen(true);
                              }}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit3 size={18} />
                            </button>

                            <button
                              onClick={() => handleSoftDelete(customer.id, customer.name)}
                              className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Xóa mềm"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(customer.id, customer.name)}
                            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Khôi phục"
                          >
                            <RotateCcw size={16} />
                            <span>Khôi phục</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Trang {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Form Modal */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleCreateOrUpdate}
        customer={editingCustomer}
        isLoading={submitting}
      />
    </div>
  );
}
