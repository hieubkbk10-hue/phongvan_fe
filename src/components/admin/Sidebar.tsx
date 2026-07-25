import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Image as ImageIcon,
  UserCheck,
  ChevronsLeft,
  ChevronsRight,
  X,
  Store,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Tổng quan', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Sản phẩm', href: '/admin/products', icon: Package },
  { label: 'Khách hàng', href: '/admin/customers', icon: Users },
  { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Thư viện Media', href: '/admin/media', icon: ImageIcon },
  { label: 'Người dùng', href: '/admin/users', icon: UserCheck },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return currentPath === '/admin' || currentPath === '/admin/dashboard';
    }
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 ease-in-out flex flex-col shadow-lg lg:shadow-none ${
          isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'
        } ${
          mobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center border-b border-slate-100 dark:border-slate-800 transition-all duration-300 ${
            isCollapsed ? 'justify-center px-0' : 'px-5 justify-between'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
              <Store size={20} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base text-slate-800 dark:text-slate-100 whitespace-nowrap">
                  Phỏng Vấn CMS
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                  Admin Panel
                </span>
              </div>
            )}
          </div>
          <button
            className="lg:hidden p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quản lý chính
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center transition-all duration-200 rounded-lg outline-none ${
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
                } ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={isCollapsed ? 22 : 20} className="shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm whitespace-nowrap truncate font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Collapse Toggle */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center h-9 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors"
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
};
