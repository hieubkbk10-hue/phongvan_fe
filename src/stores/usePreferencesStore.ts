import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ViewMode = 'grid' | 'table';

interface PreferencesState {
  pageSize: number;
  setPageSize: (size: number) => void;

  mediaViewMode: ViewMode;
  setMediaViewMode: (mode: ViewMode) => void;

  productViewMode: ViewMode;
  setProductViewMode: (mode: ViewMode) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      pageSize: 10,
      setPageSize: (size: number) => set({ pageSize: size }),

      mediaViewMode: 'grid',
      setMediaViewMode: (mode: ViewMode) => set({ mediaViewMode: mode }),

      productViewMode: 'table',
      setProductViewMode: (mode: ViewMode) => set({ productViewMode: mode }),
    }),
    {
      name: 'phongvan_user_preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
