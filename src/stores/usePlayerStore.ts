import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentSearch {
  summonerName: string;
  gameName: string;
  tagLine: string;
  profileIcon: number;
  summonerLevel: number;
  searchedAt: Date;
}

interface PlayerStoreState {
  recentSearches: RecentSearch[];
  maxRecentSearches: number;
  
  currentPlayerPuuid: string | null;
  currentPlayerName: string | null;
  
  addRecentSearch: (search: Omit<RecentSearch, 'searchedAt'>) => void;
  removeRecentSearch: (summonerName: string) => void;
  clearRecentSearches: () => void;
  setCurrentPlayer: (puuid: string, name: string) => void;
  clearCurrentPlayer: () => void;
}

export const usePlayerStore = create<PlayerStoreState>()(
  persist(
    (set) => ({
      recentSearches: [],
      maxRecentSearches: 10,
      currentPlayerPuuid: null,
      currentPlayerName: null,
      
          addRecentSearch: (search) =>
        set((state) => {
          const filtered = state.recentSearches.filter(
            (s) => s.summonerName !== search.summonerName
          );
          const newSearches = [
            { ...search, searchedAt: new Date() },
            ...filtered,
          ].slice(0, state.maxRecentSearches);
          
          return { recentSearches: newSearches };
        }),
        
      removeRecentSearch: (summonerName) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter(
            (s) => s.summonerName !== summonerName
          ),
        })),
        
      clearRecentSearches: () => set({ recentSearches: [] }),
      
      setCurrentPlayer: (puuid, name) =>
        set({ currentPlayerPuuid: puuid, currentPlayerName: name }),
        
      clearCurrentPlayer: () =>
        set({ currentPlayerPuuid: null, currentPlayerName: null }),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
      }),
    }
  )
);