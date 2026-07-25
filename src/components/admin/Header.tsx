import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Menu, Sun, Moon, LogOut, User, Search, Bell } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useUIStore } from '@/stores/useUIStore';
import { useRealtimeStore } from '@/stores/useRealtimeStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme, setMobileMenuOpen } = useUIStore();
  const { unreadNotificationsCount } = useRealtimeStore();
  const navigate = useNavigate();

  // UI: Biến state quản lý trạng thái đóng/mở dropdown thông tin cá nhân tuân thủ is[Feature][State]
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // QUYỀN: Thực hiện đăng xuất tài khoản người dùng và xóa token
  const handleLogout = () => {
    logout();
    navigate({ to: '/auth/login' });
  };

  // UI: Tự động đóng dropdown khi người dùng nhấp chuột ra phía ngoài khu vực hiển thị
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name || 'Admin User';
  const displayEmail = user?.email || 'admin@example.com';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs transition-colors">
      {/* Left side: Mobile menu toggle + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden md:block w-64 lg:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800/60 border border-transparent focus:border-blue-500 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right side: Notifications, Theme Switcher & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notifications mock icon */}
        <button
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          title="Thông báo"
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 px-1 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-auto"></div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {displayName}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {displayEmail}
              </div>
            </div>
          </button>

          {/* UI: Phân lớp Z-Index cố định z-[1000] cho Dropdown Menu theo quy chuẩn 3.3 */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-[1000] text-sm">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {displayEmail}
                </p>
              </div>

              <Link
                to="/admin/users"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <User size={16} />
                <span>Tài khoản Admin</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
