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

  // Transactional engine — null = browse, non-null = ServiceDetails
  selectedGigId: null,
  selectedGig: null,

  // ── Identity Engine ──────────────────────────────────────────────────────────
  isProfileOpen: false,

  // ── Discovery Engine ─────────────────────────────────────────────────────────
  isSearchOpen: false,

  // ── Setters ──────────────────────────────────────────────────────────────────
  setActiveDomain:        (domain)  => set({ activeDomain: domain }),
  setActiveMarketSection: (section) => set({ activeMarketSection: section }),
  setActiveIslandGroup:   (group)   => set({ activeIslandGroup: group }),
  setActiveIsland:        (island)  => set({ activeIsland: island }),
  setActiveCategory:      (cat)     => set({ activeCategory: cat }),
  setActivePriceRange:    (range)   => set({ activePriceRange: range }),

  setSelectedGig:  (gig) => set({ selectedGigId: gig?.id ?? null, selectedGig: gig ?? null }),
  clearSelectedGig: ()   => set({ selectedGigId: null, selectedGig: null }),

  setIsProfileOpen: (val) => set({ isProfileOpen: Boolean(val) }),
  toggleProfile:    ()    => set((s) => ({ isProfileOpen: !s.isProfileOpen })),

  setIsSearchOpen:  (val) => set({ isSearchOpen: Boolean(val) }),
  toggleSearch:     ()    => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
}));

export default useStore;
