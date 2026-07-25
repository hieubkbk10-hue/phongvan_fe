import { create } from 'zustand';

export interface RealtimeEventLog {
  id: string;
  channel: string;
  event: string;
  data: unknown;
  timestamp: string;
}

interface RealtimeState {
  isConnected: boolean;
  unreadNotificationsCount: number;
  logs: RealtimeEventLog[];

  setIsConnected: (connected: boolean) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
  addLog: (log: Omit<RealtimeEventLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  isConnected: false,
  unreadNotificationsCount: 0,
  logs: [],

  setIsConnected: (connected: boolean) => set({ isConnected: connected }),
  setUnreadCount: (count: number) => set({ unreadNotificationsCount: count }),
  incrementUnread: () =>
    set((state) => ({ unreadNotificationsCount: state.unreadNotificationsCount + 1 })),
  clearUnread: () => set({ unreadNotificationsCount: 0 }),

  addLog: (log) => {
    const newLog: RealtimeEventLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    };

    set((state) => ({
      logs: [newLog, ...state.logs.slice(0, 49)], // Giữ 50 log gần nhất
    }));
  },

  clearLogs: () => set({ logs: [] }),
}));
