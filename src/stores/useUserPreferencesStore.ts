import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferencesState {
  matchHistoryDisplayCount: number;
  showDetailedStats: boolean;
  
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number;
  
  setMatchHistoryDisplayCount: (count: number) => void;
  toggleDetailedStats: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'pt-BR' | 'en-US') => void;
  setAutoRefresh: (enabled: boolean, interval?: number) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      matchHistoryDisplayCount: 5,
      showDetailedStats: false,
      theme: 'system',
      language: 'pt-BR',
      autoRefreshEnabled: false,
      autoRefreshInterval: 300,
      
          setMatchHistoryDisplayCount: (count) =>
        set({ matchHistoryDisplayCount: count }),
        
      toggleDetailedStats: () =>
        set((state) => ({ showDetailedStats: !state.showDetailedStats })),
        
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => set({ language }),
      
      setAutoRefresh: (enabled, interval) =>
        set((state) => ({
          autoRefreshEnabled: enabled,
          autoRefreshInterval: interval ?? state.autoRefreshInterval,
        })),
    }),
    {
      name: 'user-preferences-storage',
    }
  )
);