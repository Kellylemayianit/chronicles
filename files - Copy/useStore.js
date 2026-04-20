import { create } from 'zustand';

const useStore = create((set) => ({
  // Top-level domain: 'Marketplace' | 'Islands'
  activeDomain: 'Marketplace',

  // Marketplace sub-category: 'FreelancerGigs' | 'BusinessGigs'
  activeMarketSection: 'FreelancerGigs',

  // Islands sub-group: 'ProCommunities' | 'OpenGroves'
  activeIslandGroup: 'OpenGroves',

  // Active island within chosen group
  activeIsland: 'Sports',

  // Filters (driven by context)
  activeCategory: 'All',
  activePriceRange: 'All',

  // Transactional engine — null means "browse" view, non-null shows ServiceDetails
  selectedGigId: null,
  selectedGig: null,   // full gig data object passed from GigCard

  setActiveDomain:       (domain)  => set({ activeDomain: domain }),
  setActiveMarketSection:(section) => set({ activeMarketSection: section }),
  setActiveIslandGroup:  (group)   => set({ activeIslandGroup: group }),
  setActiveIsland:       (island)  => set({ activeIsland: island }),
  setActiveCategory:     (cat)     => set({ activeCategory: cat }),
  setActivePriceRange:   (range)   => set({ activePriceRange: range }),

  // Select a gig — pass the full gig object so ServiceDetails has everything it needs
  setSelectedGig: (gig) => set({ selectedGigId: gig?.id ?? null, selectedGig: gig ?? null }),

  // Clear selection — navigate back to grid/feed
  clearSelectedGig: () => set({ selectedGigId: null, selectedGig: null }),
}));

export default useStore;
