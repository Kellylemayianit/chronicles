import { useState } from 'react';
import { Search, ChevronDown, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useStore from './store/useStore';
import { getRank } from './store/useStore';
import { GIGS } from './data/registry';
import Sidebar from './components/layout/Sidebar';
import GigCard from './components/marketplace/GigCard';
import ServiceDetails from './components/marketplace/ServiceDetails';
import Feed from './components/community/Feed';
import GlobalSearch from './components/layout/GlobalSearch';
import ProfileDrawer from './components/layout/ProfileDrawer';

// import './styles/index.css'; // ← wire up in main.jsx / index.js

// ─── Context-aware filter config ──────────────────────────────────────────────
const FILTER_CONFIG = {
  FreelancerGigs: {
    categories: ['All Services', 'Design', 'Dev', 'Writing', 'Marketing', 'Video'],
    prices:     ['All Prices', 'Under $20', '$20–$50', '$50–$100', '$100+'],
  },
  BusinessGigs: {
    categories: ['All Agency', 'Consultancy', 'Retail', 'Wellness'],
    prices:     ['All Prices', 'Under $100', '$100–$500', '$500+'],
  },
  ProCommunities: {
    categories: ['All Pro', 'Sports Pro', 'Beauty Pro', 'Education Pro'],
    prices:     ['All Tiers', 'Monthly', 'Annual', 'Lifetime'],
  },
  OpenGroves: {
    categories: ['All Topics', 'Sports', 'Beauty', 'Education'],
    prices:     ['Free Access'],
  },
};

// ─── Framer Motion card variants ──────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: {
      delay: i * 0.045,
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: {
    opacity: 0, scale: 0.92, y: -8,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

// ─── Dropdown helper ──────────────────────────────────────────────────────────
function FilterSelect({ value, options, onChange, disabled }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          appearance: 'none', background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border)', borderRadius: 8,
          color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
          fontSize: '0.78rem', fontWeight: 500,
          padding: '5px 28px 5px 10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-body)', outline: 'none',
        }}
      >
        {options.map(o => <option key={o} value={o} style={{ background: '#0e1812' }}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position: 'absolute', right: 8, pointerEvents: 'none', color: 'var(--text-muted)' }} />
    </div>
  );
}

// ─── XP thresholds (mirrors RANKS in useStore, kept local to avoid circular dep)
const XP_THRESHOLDS = [0, 100, 500, 1500, 5000];

// ─── Live XP / Rank widget — reads userStats directly from store ──────────────
function UserStatusWidget() {
  const { userStats } = useStore();
  const { xp } = userStats;
  const rank        = getRank(xp);
  const nextMinXP   = XP_THRESHOLDS.find(t => t > xp) ?? Infinity;
  const prevMinXP   = rank.minXP;
  const progress    = nextMinXP === Infinity
    ? 100
    : Math.min(100, Math.round(((xp - prevMinXP) / (nextMinXP - prevMinXP)) * 100));

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border)',
      borderRadius: 20, padding: '5px 12px 5px 8px',
    }}>
      <span style={{ fontSize: 16 }}>{rank.icon}</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: rank.color, transition: 'color 0.4s' }}>
            {rank.name}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{xp} XP</span>
        </div>
        <div style={{ width: 72, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden', marginTop: 3 }}>
          <div style={{
            height: '100%', borderRadius: 6, width: `${progress}%`,
            background: `linear-gradient(90deg, ${rank.color}, var(--accent-2))`,
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── Chronicles Header ────────────────────────────────────────────────────────
function ChroniclesHeader({ onMenuToggle }) {
  const {
    activeDomain, activeMarketSection, activeIslandGroup, activeIsland,
    activeCategory, setActiveCategory,
    activePriceRange, setActivePriceRange,
    toggleSearch,
  } = useStore();

  const contextKey = activeDomain === 'Marketplace' ? activeMarketSection : activeIslandGroup;
  const filters    = FILTER_CONFIG[contextKey] || FILTER_CONFIG.FreelancerGigs;

  const sectionLabel = activeDomain === 'Marketplace'
    ? (activeMarketSection === 'FreelancerGigs' ? 'Freelancer Gigs' : 'Business Gigs')
    : (activeIslandGroup === 'ProCommunities' ? `Pro · ${activeIsland}` : `Groves · ${activeIsland}`);

  return (
    <header className="chronicles-header">
      <button className="hamburger-btn" onClick={onMenuToggle} aria-label="Open menu">
        <Menu size={18} />
      </button>

      {/* Search bar — click opens GlobalSearch, which writes to store.searchQuery */}
      <div
        className="header-search"
        onClick={toggleSearch}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && toggleSearch()}
        aria-label="Open search"
      >
        <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          readOnly
          placeholder={`Search ${sectionLabel}...`}
          style={{ cursor: 'pointer', pointerEvents: 'none' }}
          tabIndex={-1}
        />
      </div>

      <div className="header-filters">
        <FilterSelect value={activeCategory} options={filters.categories} onChange={setActiveCategory} />
        <FilterSelect
          value={activePriceRange} options={filters.prices}
          onChange={setActivePriceRange}
          disabled={filters.prices.length <= 1}
        />
      </div>

      <div className="header-badge">
        {activeDomain === 'Marketplace' ? '🛍️' : '🌿'} {sectionLabel}
      </div>

      <div className="header-right">
        <UserStatusWidget />
      </div>
    </header>
  );
}

// ─── Animated empty state ──────────────────────────────────────────────────────
function EmptyState({ query, island }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        gridColumn: '1 / -1',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 24px', gap: 14,
        background: 'var(--card-bg)', borderRadius: 16,
        border: '1px dashed var(--border)',
      }}
    >
      <span style={{ fontSize: 40 }}>🌱</span>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
        No gigs found
      </p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>
        {query
          ? `No gigs match "${query}"${island ? ` in the ${island} island` : ''}.`
          : `No gigs available in the ${island} island yet.`}
      </p>
    </motion.div>
  );
}

// ─── Main App Component ───────────────────────────────────────────────────────
export default function App() {
  const {
    activeDomain, activeIsland,
    selectedGigId, selectedGig, clearSelectedGig,
    searchQuery,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(o => !o);

  // ── Dual filter: island + searchQuery ───────────────────────────────────────
  // Both filters are reactive — changing either instantly re-runs this computation
  // and AnimatePresence handles the smooth card exit/enter transitions.
  const filteredGigs = GIGS.filter(gig => {
    const matchesIsland = !activeIsland || gig.island === activeIsland;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = q.length === 0
      || gig.title.toLowerCase().includes(q)
      || gig.sellerName.toLowerCase().includes(q)
      || gig.island.toLowerCase().includes(q);
    return matchesIsland && matchesSearch;
  });

  return (
    <div className="app-shell">
      {/* Mobile sidebar overlay */}
      <div
        className={`sidebar-overlay${isMobileMenuOpen ? ' visible' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={closeMobileMenu} />

      <main className="main-content">
        <ChroniclesHeader onMenuToggle={toggleMobileMenu} />

        <div className="content-area">

          {/* ── Transactional drill-down ── */}
          {selectedGigId ? (
            <div className="service-details-page">
              <button className="service-details-back" onClick={clearSelectedGig}>
                ← Back to Gigs
              </button>
              <ServiceDetails
                gig={selectedGig}
                isOpen={true}
                onClose={clearSelectedGig}
                asPage={true}
              />
            </div>

          ) : activeDomain === 'Marketplace' ? (
            /* ── Animated Marketplace Grid ── */
            <div className="marketplace-grid">
              <AnimatePresence mode="popLayout">
                {filteredGigs.length > 0
                  ? filteredGigs.map((gig, i) => (
                      <motion.div
                        key={gig.id}
                        layout
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        // Glassmorphic hover lift is handled in GigCard via onMouseEnter;
                        // the layout prop makes positional changes spring-animated.
                        style={{ willChange: 'transform, opacity' }}
                      >
                        <GigCard {...gig} />
                      </motion.div>
                    ))
                  : <EmptyState query={searchQuery} island={activeIsland} />
                }
              </AnimatePresence>
            </div>

          ) : (
            /* ── Community Feed ── */
            <Feed activeIsland={activeIsland} />
          )}
        </div>
      </main>

      {/* ── Global overlays — above all content ── */}
      <GlobalSearch />
      <ProfileDrawer />
    </div>
  );
}
