import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface UIState {
  // Theme state
  theme: ThemeMode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Sidebar state
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Mobile Menu state
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

const applyThemeToDOM = (isDark: boolean) => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
  }
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isDarkMode: false,

      toggleTheme: () => {
        const nextMode: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
        const isDark = nextMode === 'dark';
        applyThemeToDOM(isDark);
        set({ theme: nextMode, isDarkMode: isDark });
      },

      setTheme: (theme: ThemeMode) => {
        const isDark = theme === 'dark';
        applyThemeToDOM(isDark);
        set({ theme, isDarkMode: isDark });
      },

      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),

      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),
    }),
    {
      name: 'phongvan_ui_preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        isDarkMode: state.isDarkMode,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.isDarkMode);
        }
      },
    }
  )
);
