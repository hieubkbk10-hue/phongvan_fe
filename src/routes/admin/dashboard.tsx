import { createFileRoute, Link } from '@tanstack/react-router';
import { Package, Users, ShoppingCart, Image as ImageIcon, ArrowUpRight, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Hệ thống Quản trị CMS
          </span>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Chào mừng trở lại, Administrator!
          </h1>
          <p className="mt-2 text-blue-100 text-sm leading-relaxed">
            Hệ thống quản lý sản phẩm, đơn hàng và khách hàng theo chuẩn nghiệp vụ Laravel Apiato.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-6 translate-y-6 pointer-events-none">
          <ShoppingCart size={240} />
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sản phẩm</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">--</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp size={12} /> Đang kinh doanh
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Đơn hàng Pending</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">--</h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1 font-medium">
              <Clock size={12} /> Cần xử lý
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Khách hàng</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">--</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Định dạng E.164
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thư viện Media</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">--</h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
              Max 9 ảnh / sản phẩm
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ImageIcon size={24} />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Lối tắt quản lý</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products"
            className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Package size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Quản lý Sản phẩm</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Thêm mới, sửa thông tin, đổi trạng thái Active/Inactive & upload Media ảnh.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/customers"
            className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Quản lý Khách hàng</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Lưu thông tin khách hàng, số điện thoại E.164, tính năng xóa mềm và khôi phục.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Quản lý Đơn hàng</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tạo đơn hàng, snapshot giá/khách hàng, hoàn thành giao hàng hoặc hủy đơn.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
