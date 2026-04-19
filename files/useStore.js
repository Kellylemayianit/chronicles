import { create } from 'zustand';

const useStore = create((set) => ({
  activeMode: 'Marketplace', // 'Marketplace' | 'Community'
  activeIsland: 'Sports',    // 'Sports' | 'Beauty' | 'Education'

  setActiveMode: (mode) => set({ activeMode: mode }),
  setActiveIsland: (island) => set({ activeIsland: island }),
}));

export default useStore;
