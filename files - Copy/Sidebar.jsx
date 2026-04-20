import { useState } from 'react';
import {
  ShoppingBag, Building2, Trophy, Leaf,
  ChevronLeft, ChevronRight,
  Zap, Sparkles, BookOpen,
  ShoppingCart, FileText, Package, Bookmark, DollarSign,
  Rss, School, BarChart2, Calendar, Users,
} from 'lucide-react';
import useStore from '../../store/useStore';

// ─── Config ───────────────────────────────────────────────────────────────────

const ISLANDS = [
  { id: 'Sports',    label: 'Sports',    Icon: Zap },
  { id: 'Beauty',    label: 'Beauty',    Icon: Sparkles },
  { id: 'Education', label: 'Education', Icon: BookOpen },
];

const MARKETPLACE_SECTIONS = [
  { id: 'FreelancerGigs', label: 'Freelancer Gigs', Icon: ShoppingBag,
    description: 'Individual providers' },
  { id: 'BusinessGigs',   label: 'Business Gigs',   Icon: Building2,
    description: 'Verified businesses' },
];

const ISLAND_GROUPS = [
  { id: 'ProCommunities', label: 'Pro Communities', Icon: Trophy,
    badge: 'Paid', badgeColor: 'var(--accent-2)', badgeBg: 'rgba(245,158,11,0.12)' },
  { id: 'OpenGroves',     label: 'Open Groves',     Icon: Leaf,
    badge: 'Free', badgeColor: 'var(--accent)',    badgeBg: 'rgba(82,183,136,0.12)' },
];

const MARKETPLACE_LINKS = [
  { label: 'Browse Gigs',    Icon: ShoppingCart },
  { label: 'Post a Request', Icon: FileText },
  { label: 'My Orders',      Icon: Package },
  { label: 'Saved',          Icon: Bookmark },
  { label: 'Earnings',       Icon: DollarSign },
];

const COMMUNITY_LINKS = [
  { label: 'Feed',        Icon: Rss },
  { label: 'Classrooms',  Icon: School },
  { label: 'Leaderboard', Icon: BarChart2 },
  { label: 'Events',      Icon: Calendar },
  { label: 'Members',     Icon: Users },
];

// ─── Inline sub-styles (non-layout, non-width: purely cosmetic) ──────────────

const sectionLabel = {
  fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
  color: 'var(--text-muted)', textTransform: 'uppercase',
  paddingLeft: 8, marginBottom: 6,
};

const divider = {
  height: 1, background: 'var(--border)', margin: '6px 14px',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ isMobileOpen, onMobileClose }) {
  const {
    activeDomain, setActiveDomain,
    activeMarketSection, setActiveMarketSection,
    activeIslandGroup, setActiveIslandGroup,
    activeIsland, setActiveIsland,
  } = useStore();

  const [collapsed, setCollapsed] = useState(false);

  const contextLinks = activeDomain === 'Marketplace' ? MARKETPLACE_LINKS : COMMUNITY_LINKS;

  // When a mobile nav item is clicked, close the drawer
  const handleMobileNav = (fn) => () => { fn(); onMobileClose?.(); };

  // ── Shared button factory ──────────────────────────────────────────────────
  const navBtn = (isActive, accentColor, activeBg, onClick, content, title) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        width: '100%', padding: collapsed ? '10px 0' : '9px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 10, border: 'none', cursor: 'pointer',
        background: isActive ? activeBg : 'transparent',
        color: isActive ? accentColor : 'var(--text-secondary)',
        fontWeight: isActive ? 700 : 500,
        fontSize: '0.85rem', marginBottom: 2,
        transition: 'all 0.15s ease',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--hover-bg)'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {content}
    </button>
  );

  // Compute sidebar class names
  const sidebarClasses = [
    'sidebar',
    collapsed ? 'collapsed' : '',
    isMobileOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClasses}>

      {/* ── Logo ── */}
      <div style={{ padding: '18px 14px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px var(--glow)', fontSize: 17,
        }}>
          📜
        </div>
        {!collapsed && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1rem',
            fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap',
          }}>
            Chronicles
          </span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text-muted)',
            flexShrink: 0, padding: '2px 4px', borderRadius: 6,
            display: 'flex', alignItems: 'center',
          }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ─── DOMAIN ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '4px 10px' }}>
        {!collapsed && <p style={sectionLabel}>Domain</p>}
        {['Marketplace', 'Islands'].map(domain => {
          const isActive = activeDomain === domain;
          const Icon = domain === 'Marketplace' ? ShoppingBag : Leaf;
          return navBtn(
            isActive, 'var(--accent)', 'var(--active-bg)',
            handleMobileNav(() => setActiveDomain(domain)),
            <>
              <Icon size={15} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{domain}</span>}
              {!collapsed && isActive && (
                <span style={{
                  marginLeft: 'auto', width: 5, height: 5,
                  borderRadius: '50%', background: 'var(--accent)', flexShrink: 0,
                }} />
              )}
            </>,
            domain,
          );
        })}
      </div>

      <div style={divider} />

      {/* ─── SUB-CATEGORY ───────────────────────────────────────────────────── */}
      {activeDomain === 'Marketplace' ? (
        <div style={{ padding: '4px 10px' }}>
          {!collapsed && <p style={sectionLabel}>Category</p>}
          {MARKETPLACE_SECTIONS.map(({ id, label, Icon, description }) => {
            const isActive = activeMarketSection === id;
            return (
              <div key={id}>
                {navBtn(
                  isActive, 'var(--accent-2)', 'var(--island-active-bg)',
                  handleMobileNav(() => setActiveMarketSection(id)),
                  <>
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    {!collapsed && (
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ whiteSpace: 'nowrap', lineHeight: 1.3 }}>{label}</div>
                        {isActive && (
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            {description}
                          </div>
                        )}
                      </div>
                    )}
                  </>,
                  label,
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '4px 10px' }}>
          {!collapsed && <p style={sectionLabel}>Group</p>}
          {ISLAND_GROUPS.map(({ id, label, Icon, badge, badgeColor, badgeBg }) => {
            const isActive = activeIslandGroup === id;
            return (
              <div key={id}>
                {navBtn(
                  isActive, 'var(--accent-2)', 'var(--island-active-bg)',
                  () => setActiveIslandGroup(id),
                  <>
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    {!collapsed && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                        <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
                        <span style={{
                          fontSize: '0.6rem', fontWeight: 700,
                          color: badgeColor, background: badgeBg,
                          borderRadius: 4, padding: '1px 5px',
                          border: `1px solid ${badgeColor}33`, lineHeight: 1.5,
                        }}>
                          {badge}
                        </span>
                      </div>
                    )}
                  </>,
                  label,
                )}
                {isActive && !collapsed && (
                  <div style={{ paddingLeft: 12, marginBottom: 4 }}>
                    {ISLANDS.map(({ id: islandId, label: islandLabel, Icon: IslandIcon }) => {
                      const isIslandActive = activeIsland === islandId;
                      return (
                        <button
                          key={islandId}
                          onClick={handleMobileNav(() => setActiveIsland(islandId))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            width: '100%', padding: '7px 10px',
                            borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: isIslandActive ? 'rgba(82,183,136,0.08)' : 'transparent',
                            color: isIslandActive ? 'var(--accent)' : 'var(--text-muted)',
                            fontSize: '0.8rem', fontWeight: isIslandActive ? 600 : 400,
                            fontFamily: 'var(--font-body)', marginBottom: 1,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => { if (!isIslandActive) e.currentTarget.style.background = 'var(--hover-bg)'; }}
                          onMouseLeave={e => { if (!isIslandActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <IslandIcon size={12} style={{ flexShrink: 0 }} />
                          <span>{islandLabel}</span>
                          {isIslandActive && (
                            <div style={{
                              marginLeft: 'auto', width: 4, height: 4,
                              borderRadius: '50%', background: 'var(--accent)',
                            }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={divider} />

      {/* ─── CONTEXTUAL LINKS ───────────────────────────────────────────────── */}
      <div style={{ padding: '4px 10px', flex: 1, overflowY: 'auto' }}>
        {!collapsed && <p style={sectionLabel}>{activeDomain}</p>}
        {contextLinks.map(({ label, Icon }) => (
          <a
            key={label}
            href="#"
            title={label}
            onClick={e => { e.preventDefault(); onMobileClose?.(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: collapsed ? '10px 0' : '9px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 10, textDecoration: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem', fontWeight: 500, marginBottom: 2,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon size={15} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
          </a>
        ))}
      </div>

      {/* ─── User footer ────────────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 14px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--sidebar-footer-bg)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #a3b899, #3a7d44)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
        }}>
          K
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Kamau M.
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--accent)', whiteSpace: 'nowrap' }}>
              🌿 Sprout · 240 XP
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
