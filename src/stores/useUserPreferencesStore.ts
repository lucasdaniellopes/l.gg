import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferencesState {
  // Match history preferences
  matchHistoryDisplayCount: number;
  showDetailedStats: boolean;
  
  // UI preferences
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  
  // Data preferences
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number; // in seconds
  
  // Actions
  setMatchHistoryDisplayCount: (count: number) => void;
  toggleDetailedStats: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'pt-BR' | 'en-US') => void;
  setAutoRefresh: (enabled: boolean, interval?: number) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      // Initial state
      matchHistoryDisplayCount: 5,
      showDetailedStats: false,
      theme: 'system',
      language: 'pt-BR',
      autoRefreshEnabled: false,
      autoRefreshInterval: 300, // 5 minutes
      
      // Actions
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