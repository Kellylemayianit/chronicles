import { useState } from 'react';
import { Search, ChevronDown, Menu } from 'lucide-react';
import useStore from './store/useStore';
import useGamification from './hooks/useGamification';
import Sidebar from './components/layout/Sidebar';
import GigCard from './components/marketplace/GigCard';
import ServiceDetails from './components/marketplace/ServiceDetails';
import Feed from './components/community/Feed';
import GlobalSearch from './components/layout/GlobalSearch';
import ProfileDrawer from './components/layout/ProfileDrawer';

// import './styles/index.css';  ← uncomment in your Vite/CRA entry point

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

// ─── XP / Rank mini-widget ────────────────────────────────────────────────────
function UserStatusWidget() {
  const { rank, progress, xp } = useGamification(240);
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
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: rank.color }}>{rank.name}</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{xp} XP</span>
        </div>
        <div style={{ width: 72, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden', marginTop: 3 }}>
          <div style={{ height: '100%', borderRadius: 6, width: `${progress}%`, background: `linear-gradient(90deg, ${rank.color}, var(--accent-2))`, transition: 'width 0.6s ease' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Chronicles Header ────────────────────────────────────────────────────────
function ChroniclesHeader({ onMenuToggle }) {
  const {
    activeDomain, activeMarketSection, activeIslandGroup,
    activeIsland, activeCategory, setActiveCategory,
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
      {/* Hamburger — visible on mobile only */}
      <button className="hamburger-btn" onClick={onMenuToggle} aria-label="Open menu">
        <Menu size={18} />
      </button>

      {/* Search bar — clicking opens GlobalSearch overlay */}
      <div className="header-search" onClick={toggleSearch} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && toggleSearch()}>
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
        <FilterSelect value={activePriceRange} options={filters.prices} onChange={setActivePriceRange} disabled={filters.prices.length <= 1} />
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

// ─── Main App Component ───────────────────────────────────────────────────────
export default function App() {
  const { activeDomain, activeIsland, selectedGigId, selectedGig, clearSelectedGig } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(o => !o);

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
          {/* ── Transactional Engine ── */}
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
            <div className="marketplace-grid">
              <GigCard id="gig-001" island={activeIsland} emoji="🎨" />
              <GigCard id="gig-002" title="Local Logistics Hero"          price={15}  rating={5.0} reviewCount={12} island={activeIsland} imageBg="linear-gradient(135deg,#1a3a2a,#2d6a4f)"  emoji="🚚" sellerName="Brian O."   sellerXP={650}  />
              <GigCard id="gig-003" title="Island Beauty Pack"            price={85}  rating={4.8} reviewCount={44} island={activeIsland} imageBg="linear-gradient(135deg,#2a1a3a,#6a2d6a)"  emoji="✨" sellerName="Wanjiku G." sellerXP={2200} />
              <GigCard id="gig-004" title="Sports Coaching Session"       price={35}  rating={4.7} reviewCount={89} island="Sports"       imageBg="linear-gradient(135deg,#1a2a3a,#2d4f6a)"  emoji="⚽" sellerName="Otieno K."  sellerXP={3100} deliveryDays={1} />
              <GigCard id="gig-005" title="Curriculum Design & Tutoring"  price={60}  rating={5.0} reviewCount={23} island="Education"    imageBg="linear-gradient(135deg,#1a2a1a,#3a6a2d)"  emoji="📚" sellerName="Njeri W."   sellerXP={980}  deliveryDays={5} />
              <GigCard id="gig-006" title="Brand Identity Full Package"   price={120} rating={4.9} reviewCount={61} island={activeIsland} imageBg="linear-gradient(135deg,#3a2a1a,#6a4f2d)"  emoji="🏷️" sellerName="Amina S."  sellerXP={4500} deliveryDays={7} />
            </div>
          ) : (
            <Feed activeIsland={activeIsland} />
          )}
        </div>
      </main>

      {/* ── Global overlays — mounted outside main to avoid z-index conflicts ── */}
      <GlobalSearch />
      <ProfileDrawer />
    </div>
  );
}
