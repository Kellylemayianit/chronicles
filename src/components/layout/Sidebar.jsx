import { useState } from 'react';
import useStore from '../../store/useStore';

const ISLANDS = ['Sports', 'Beauty', 'Education'];

const ISLAND_ICONS = {
  Sports: '⚡',
  Beauty: '✨',
  Education: '📚',
};

const MARKETPLACE_LINKS = [
  { label: 'Browse Gigs', icon: '🛒', href: '#' },
  { label: 'Post a Request', icon: '📝', href: '#' },
  { label: 'My Orders', icon: '📦', href: '#' },
  { label: 'Saved', icon: '🔖', href: '#' },
  { label: 'Earnings', icon: '💰', href: '#' },
];

const COMMUNITY_LINKS = [
  { label: 'Feed', icon: '🌿', href: '#' },
  { label: 'Classrooms', icon: '🏫', href: '#' },
  { label: 'Leaderboard', icon: '🏆', href: '#' },
  { label: 'Events', icon: '🗓️', href: '#' },
  { label: 'Members', icon: '👥', href: '#' },
];

export default function Sidebar() {
  const { activeMode, setActiveMode, activeIsland, setActiveIsland } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const contextLinks = activeMode === 'Marketplace' ? MARKETPLACE_LINKS : COMMUNITY_LINKS;

  return (
    <aside
      className="kimana-sidebar"
      style={{
        width: collapsed ? '72px' : '240px',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0, boxShadow: '0 2px 12px var(--glow)',
        }}>
          🦋
        </div>
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Kimana
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16,
            flexShrink: 0, padding: '2px 4px', borderRadius: 6,
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* === GLOBAL SECTION: Mode Switcher === */}
      <div style={{ padding: '8px 10px' }}>
        {!collapsed && (
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: 8, marginBottom: 6 }}>
            Mode
          </p>
        )}
        {['Marketplace', 'Community'].map((mode) => {
          const isActive = activeMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              title={mode}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: collapsed ? '10px 16px' : '9px 12px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: isActive ? 'var(--active-bg)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                marginBottom: 2,
                transition: 'all 0.15s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{mode === 'Marketplace' ? '🛍️' : '🌿'}</span>
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{mode}</span>}
              {!collapsed && isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '6px 14px' }} />

      {/* === GLOBAL SECTION: Island Switcher === */}
      <div style={{ padding: '8px 10px' }}>
        {!collapsed && (
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: 8, marginBottom: 6 }}>
            Island
          </p>
        )}
        {ISLANDS.map((island) => {
          const isActive = activeIsland === island;
          return (
            <button
              key={island}
              onClick={() => setActiveIsland(island)}
              title={island}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: collapsed ? '10px 16px' : '9px 12px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: isActive ? 'var(--island-active-bg)' : 'transparent',
                color: isActive ? 'var(--accent-2)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                marginBottom: 2,
                transition: 'all 0.15s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{ISLAND_ICONS[island]}</span>
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{island}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '6px 14px' }} />

      {/* === CONTEXTUAL SECTION: Mode-specific links === */}
      <div style={{ padding: '8px 10px', flex: 1 }}>
        {!collapsed && (
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: 8, marginBottom: 6 }}>
            {activeMode}
          </p>
        )}
        {contextLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            title={link.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px 16px' : '9px 12px',
              borderRadius: 10, textDecoration: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem', fontWeight: 500,
              marginBottom: 2,
              transition: 'all 0.15s ease',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{link.icon}</span>
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>}
          </a>
        ))}
      </div>

      {/* User profile footer */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--sidebar-footer-bg)',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a3b899, #3a7d44)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, flexShrink: 0, fontWeight: 700, color: '#fff',
        }}>
          K
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Kamau M.</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent)', whiteSpace: 'nowrap' }}>🌿 Sprout · 240 XP</div>
          </div>
        )}
      </div>
    </aside>
  );
}
