import { useState } from 'react';
import { Search, ChevronDown, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useStore, { getRank } from './store/useStore';
import { GIGS } from './data/registry';
import Sidebar from './components/layout/Sidebar';
import GigCard from './components/marketplace/GigCard';
import ServiceDetails from './components/marketplace/ServiceDetails';
import Feed from './components/community/Feed';
import Classroom from './components/community/Classroom';
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
  hidden:  { opacity: 0, scale: 0.94, y: 12 },
  visible: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: i * 0.045, duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: {
    opacity: 0, scale: 0.92, y: -8,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

// ─── XP thresholds (mirrors RANKS — local copy avoids circular dep) ──────────
const XP_THRESHOLDS = [0, 100, 500, 1500, 5000];

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

// ─── Live XP / Rank widget ────────────────────────────────────────────────────
function UserStatusWidget() {
  const { userStats } = useStore();
  const { xp }       = userStats;
  const rank         = getRank(xp);
  const nextMinXP    = XP_THRESHOLDS.find(t => t > xp) ?? Infinity;
  const progress     = nextMinXP === Infinity
    ? 100
    : Math.min(100, Math.round(((xp - rank.minXP) / (nextMinXP - rank.minXP)) * 100));

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
        <FilterSelect value={activeCategory}   options={filters.categories} onChange={setActiveCategory} />
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

// ─── Animated empty state ─────────────────────────────────────────────────────
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

// ─── Islands view — toggles between Feed and Classroom via sidebar links ──────
// The Sidebar's "Classrooms" link will eventually set an activeIslandView state.
// For now we expose a simple tab toggle inside the content area.
function IslandsView() {
  const { activeIsland } = useStore();
  const [view, setView]  = useState('feed'); // 'feed' | 'classroom'

  return (
    <div>
      {/* ── View toggle tabs ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: 4,
        width: 'fit-content',
      }}>
        {[
          { id: 'feed',      label: '🌿 Feed'      },
          { id: 'classroom', label: '📚 Classroom'  },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            style={{
              padding: '7px 18px', borderRadius: 9, border: 'none',
              background: view === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: view === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: view === tab.id ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: view === tab.id ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Animated view swap ── */}
      <AnimatePresence mode="wait">
        {view === 'feed' ? (
          <motion.div
            key="feed"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Feed reads activeIsland and searchQuery from the store itself */}
            <Feed />
          </motion.div>
        ) : (
          <motion.div
            key="classroom"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Classroom />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const {
    activeDomain, activeIsland,
    selectedGigId, selectedGig, clearSelectedGig,
    searchQuery,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu  = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(o => !o);

  // ── Dual filter: island + searchQuery (Marketplace only) ─────────────────
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
            /* ── Islands: Feed + Classroom ── */
            <IslandsView />
          )}
        </div>
      </main>

      {/* ── Global overlays ── */}
      <GlobalSearch />
      <ProfileDrawer />
    </div>
  );
}
