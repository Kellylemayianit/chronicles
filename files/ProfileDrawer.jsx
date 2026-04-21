import { X, Settings, Share2, Zap, Sparkles, BookOpen, ShoppingBag } from 'lucide-react';
import useStore, { getRank, RANKS } from '../../store/useStore';

// ─── Static profile metadata (non-reactive) ──────────────────────────────────
const PROFILE = {
  name:       'Kaelen',
  handle:     '@kaelen.chronicles',
  initials:   'K',
  gigs:       3,
  orders:     12,
  posts:      47,
  islands:    ['Sports', 'Beauty'],
  joined:     'Jan 2025',
  avatarGrad: 'linear-gradient(135deg, #52b788 0%, #3a7d44 50%, #f59e0b 100%)',
  headerGrad: 'linear-gradient(135deg, #0a1c10 0%, #152c1a 50%, #0e1812 100%)',
};

const ISLAND_CHIPS = {
  Sports:    { color: 'var(--island-sports-color)',    bg: 'var(--island-sports-bg)',    icon: <Zap size={12} />      },
  Beauty:    { color: 'var(--island-beauty-color)',    bg: 'var(--island-beauty-bg)',    icon: <Sparkles size={12} /> },
  Education: { color: 'var(--island-education-color)', bg: 'var(--island-education-bg)', icon: <BookOpen size={12} /> },
};

// ─── XP Aura ring — visual representation of userStats.aura ──────────────────
function AuraRing({ aura, color }) {
  const r   = 22;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - aura / 100);
  return (
    <svg
      width={52} height={52}
      style={{ position: 'absolute', inset: -4, zIndex: 1 }}
      viewBox="0 0 52 52"
    >
      <circle cx={26} cy={26} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
      <circle
        cx={26} cy={26} r={r} fill="none"
        stroke={color} strokeWidth={3}
        strokeDasharray={circ}
        strokeDashoffset={fill}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProfileDrawer() {
  const { isProfileOpen, setIsProfileOpen, userStats } = useStore();

  // Derive rank directly from live userStats.xp — updates instantly on addXP()
  const { xp, aura } = userStats;
  const rank     = getRank(xp);
  const nextRank = RANKS.find(r => r.minXP > xp) ?? null;
  const progress = nextRank
    ? Math.min(100, Math.round(((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100))
    : 100;

  const close = () => setIsProfileOpen(false);

  return (
    <>
      {/* Backdrop */}
      {isProfileOpen && (
        <div className="overlay-backdrop" style={{ zIndex: 199 }} onClick={close} />
      )}

      {/* Drawer */}
      <aside className={`profile-drawer${isProfileOpen ? ' open' : ''}`}>

        {/* ── Header band ── */}
        <div className="profile-drawer__header">
          <div className="profile-drawer__header-bg" style={{ background: PROFILE.headerGrad }} />
          {/* Glow orbs */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${rank.color}30 0%, transparent 70%)`, zIndex: 1, transition: 'background 0.5s ease' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 60, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', zIndex: 1 }} />
          <div className="profile-drawer__header-overlay" />

          <button className="profile-drawer__close" onClick={close} aria-label="Close profile">
            <X size={14} />
          </button>

          {/* Avatar with live aura ring */}
          <div className="profile-drawer__avatar-wrap">
            <div style={{ position: 'relative', width: 72, height: 72 }}>
              <AuraRing aura={aura} color={rank.color} />
              <div
                className="profile-drawer__avatar"
                style={{ background: PROFILE.avatarGrad, position: 'relative', zIndex: 2 }}
              >
                {PROFILE.initials}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="profile-drawer__body">

          {/* Name & handle */}
          <h2 className="profile-drawer__name">{PROFILE.name}</h2>
          <p className="profile-drawer__handle">{PROFILE.handle} · Joined {PROFILE.joined}</p>

          {/* Live rank badge */}
          <div
            className="profile-drawer__rank-badge"
            style={{
              color: rank.color,
              background: rank.color + '18',
              borderColor: rank.color + '33',
              transition: 'color 0.4s, background 0.4s, border-color 0.4s',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{rank.icon}</span>
            <span>{rank.name}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>·</span>
            <ShoppingBag size={11} style={{ opacity: 0.6 }} />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.7rem' }}>Vibe Coder</span>
          </div>

          {/* Live XP progress bar */}
          <div className="profile-drawer__xp-section">
            <div className="profile-drawer__xp-label">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                XP Progress
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: rank.color, transition: 'color 0.4s' }}>
                {xp.toLocaleString()} / {nextRank?.minXP.toLocaleString() ?? '∞'} XP
              </span>
            </div>
            <div className="profile-drawer__xp-bar-track">
              <div
                className="profile-drawer__xp-bar-fill"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${rank.color}, var(--accent-2))`,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              <span>{rank.name}</span>
              {nextRank && <span>Next: {nextRank.name} {nextRank.icon}</span>}
            </div>
          </div>

          {/* Aura score row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', borderRadius: 12, marginBottom: 20,
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.1rem' }}>✨</span>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aura Score</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Community reputation</div>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-2)' }}>
              {aura}
            </span>
          </div>

          {/* Activity stats */}
          <p className="profile-drawer__section-title">Activity</p>
          <div className="profile-drawer__stats-grid">
            {[
              { value: PROFILE.gigs,   label: 'Gigs Listed' },
              { value: PROFILE.orders, label: 'Orders'      },
              { value: PROFILE.posts,  label: 'Posts'       },
            ].map(({ value, label }) => (
              <div className="profile-drawer__stat-card" key={label}>
                <div className="profile-drawer__stat-value">{value}</div>
                <div className="profile-drawer__stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Island chips */}
          <p className="profile-drawer__section-title">My Islands</p>
          <div className="profile-drawer__islands">
            {PROFILE.islands.map(isl => {
              const chip = ISLAND_CHIPS[isl] ?? ISLAND_CHIPS.Sports;
              return (
                <span key={isl} className="profile-drawer__island-chip" style={{ color: chip.color, background: chip.bg }}>
                  {chip.icon}
                  {isl}
                </span>
              );
            })}
          </div>

          {/* Recent activity skeleton rows */}
          <p className="profile-drawer__section-title">Recent Activity</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[80, 65, 72].map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div className="skeleton" style={{ height: 10, width: `${w}%` }} />
                  <div className="skeleton" style={{ height: 8, width: '45%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="profile-drawer__footer">
          <button className="profile-drawer__btn profile-drawer__btn--primary">Edit Profile</button>
          <button className="profile-drawer__btn profile-drawer__btn--secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', padding: '10px 16px' }}>
            <Settings size={14} />
          </button>
          <button className="profile-drawer__btn profile-drawer__btn--secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', padding: '10px 16px' }}>
            <Share2 size={14} />
          </button>
        </div>
      </aside>
    </>
  );
}
