import { create } from 'zustand';

// ─── Rank thresholds (exported so useGamification can share the same table) ───
export const RANKS = [
  { name: 'Seedling', icon: '🌱', minXP: 0,    color: '#86efac' },
  { name: 'Sprout',   icon: '🌿', minXP: 100,  color: '#52b788' },
  { name: 'Grove',    icon: '🌳', minXP: 500,  color: '#22c55e' },
  { name: 'Canopy',   icon: '🌲', minXP: 1500, color: '#16a34a' },
  { name: 'Ancient',  icon: '🌴', minXP: 5000, color: '#f59e0b' },
];

// Helper — derive rank object from raw XP value
export const getRank = (xp) =>
  [...RANKS].reverse().find(r => xp >= r.minXP) ?? RANKS[0];

const useStore = create((set, get) => ({
  // ── Navigation ──────────────────────────────────────────────────────────────
  activeDomain:        'Marketplace',
  activeMarketSection: 'FreelancerGigs',
  activeIslandGroup:   'OpenGroves',
  activeIsland:        'Sports',

  // ── Filters ─────────────────────────────────────────────────────────────────
  activeCategory:   'All',
  activePriceRange: 'All',

  // ── Discovery Engine ─────────────────────────────────────────────────────────
  // searchQuery is the single reactive string consumed by GlobalSearch overlay
  // AND the Marketplace grid filter simultaneously.
  searchQuery:  '',
  isSearchOpen: false,

  // ── Identity Engine ──────────────────────────────────────────────────────────
  isProfileOpen: false,

  // userStats — live identity object. All XP/Aura UI binds here.
  userStats: {
    xp:   240,
    aura: 85,
  },

  // ── Transactional Engine ─────────────────────────────────────────────────────
  selectedGigId: null,
  selectedGig:   null,

  // ── Navigation setters ───────────────────────────────────────────────────────
  setActiveDomain:        (domain)  => set({ activeDomain: domain }),
  setActiveMarketSection: (section) => set({ activeMarketSection: section }),
  setActiveIslandGroup:   (group)   => set({ activeIslandGroup: group }),
  setActiveIsland:        (island)  => set({ activeIsland: island }),
  setActiveCategory:      (cat)     => set({ activeCategory: cat }),
  setActivePriceRange:    (range)   => set({ activePriceRange: range }),

  // ── Discovery setters ────────────────────────────────────────────────────────
  setSearchQuery: (q) => set({ searchQuery: q }),

  setIsSearchOpen: (val) => set({ isSearchOpen: Boolean(val) }),
  toggleSearch:    ()    => set((s) => ({ isSearchOpen: !s.isSearchOpen })),

  // ── Identity setters ─────────────────────────────────────────────────────────
  setIsProfileOpen: (val) => set({ isProfileOpen: Boolean(val) }),
  toggleProfile:    ()    => set((s) => ({ isProfileOpen: !s.isProfileOpen })),

  // addXP — atomically mutates userStats so every subscribed component
  // (ProfileDrawer XP bar, Sidebar XP label, UserStatusWidget) re-renders live.
  // Aura gains +1 per 5 XP, soft-capped at 100.
  addXP: (amount) => {
    const { userStats } = get();
    const newXP   = userStats.xp + amount;
    const newAura = Math.min(100, userStats.aura + Math.floor(amount / 5));
    set({ userStats: { xp: newXP, aura: newAura } });
  },

  setUserStats: (partial) =>
    set((s) => ({ userStats: { ...s.userStats, ...partial } })),

  // ── Transactional setters ────────────────────────────────────────────────────
  setSelectedGig:  (gig) => set({ selectedGigId: gig?.id ?? null, selectedGig: gig ?? null }),
  clearSelectedGig: ()   => set({ selectedGigId: null, selectedGig: null }),
}));

export default useStore;
