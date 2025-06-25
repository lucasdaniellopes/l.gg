import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChampionFilter {
  searchQuery: string;
  selectedTags: string[];
  sortBy: 'name' | 'difficulty' | 'winRate';
  sortOrder: 'asc' | 'desc';
}

interface ChampionStoreState {
  filters: ChampionFilter;
  
  viewMode: 'grid' | 'list';
  showOnlyFavorites: boolean;
  
  localFavorites: string[];
  
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  setSortBy: (sortBy: ChampionFilter['sortBy']) => void;
  toggleSortOrder: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  toggleShowOnlyFavorites: () => void;
  toggleLocalFavorite: (championId: string) => void;
  resetFilters: () => void;
}

const defaultFilters: ChampionFilter = {
  searchQuery: '',
  selectedTags: [],
  sortBy: 'name',
  sortOrder: 'asc',
};

export const useChampionStore = create<ChampionStoreState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      viewMode: 'grid',
      showOnlyFavorites: false,
      localFavorites: [],
      
          setSearchQuery: (query) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        })),
        
      toggleTag: (tag) =>
        set((state) => {
          const selectedTags = state.filters.selectedTags.includes(tag)
            ? state.filters.selectedTags.filter((t) => t !== tag)
            : [...state.filters.selectedTags, tag];
          return {
            filters: { ...state.filters, selectedTags },
          };
        }),
        
      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy },
        })),
        
      toggleSortOrder: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            sortOrder: state.filters.sortOrder === 'asc' ? 'desc' : 'asc',
          },
        })),
        
      setViewMode: (mode) => set({ viewMode: mode }),
      
      toggleShowOnlyFavorites: () =>
        set((state) => ({ showOnlyFavorites: !state.showOnlyFavorites })),
        
      toggleLocalFavorite: (championId) =>
        set((state) => {
          const localFavorites = state.localFavorites.includes(championId)
            ? state.localFavorites.filter((id) => id !== championId)
            : [...state.localFavorites, championId];
          return { localFavorites };
        }),
        
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'champion-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        localFavorites: state.localFavorites,
      }),
    }
  )
);