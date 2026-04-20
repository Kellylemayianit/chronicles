import { X, Settings, Share2, Star, Zap, Sparkles, BookOpen, ShoppingBag } from 'lucide-react';
import useStore from '../../store/useStore';
import useGamification from '../../hooks/useGamification';

// ─── User data (skeleton / mock) ─────────────────────────────────────────────
const USER = {
  name:      'Kaelen',
  handle:    '@kaelen.chronicles',
  initials:  'K',
  xp:        240,
  gigs:      3,
  orders:    12,
  posts:     47,
  islands:   ['Sports', 'Beauty'],
  joined:    'Jan 2025',
  avatarGrad: 'linear-gradient(135deg, #52b788 0%, #3a7d44 50%, #f59e0b 100%)',
  headerGrad: 'linear-gradient(135deg, #0a1c10 0%, #152c1a 50%, #0e1812 100%)',
};

const ISLAND_CHIP_COLORS = {
  Sports:    { color: 'var(--island-sports-color)',    bg: 'var(--island-sports-bg)',    icon: <Zap size={12} /> },
  Beauty:    { color: 'var(--island-beauty-color)',    bg: 'var(--island-beauty-bg)',    icon: <Sparkles size={12} /> },
  Education: { color: 'var(--island-education-color)', bg: 'var(--island-education-bg)', icon: <BookOpen size={12} /> },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProfileDrawer() {
  const { isProfileOpen, setIsProfileOpen } = useStore();
  const { rank, nextRank, progress, xp } = useGamification(USER.xp);

  const close = () => setIsProfileOpen(false);

  return (
    <>
      {/* Backdrop */}
      {isProfileOpen && (
        <div
          className="overlay-backdrop"
          style={{ zIndex: 199 }}
          onClick={close}
        />
      )}

      {/* Drawer */}
      <aside className={`profile-drawer${isProfileOpen ? ' open' : ''}`}>

        {/* ── Colourful header band ── */}
        <div className="profile-drawer__header">
          <div
            className="profile-drawer__header-bg"
            style={{ background: USER.headerGrad }}
          />
          {/* Geometric glow orbs */}
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 180, height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(82,183,136,0.2) 0%, transparent 70%)',
            zIndex: 1,
          }} />
          <div style={{
            position: 'absolute', bottom: -20, left: 60, width: 100, height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
            zIndex: 1,
          }} />
          <div className="profile-drawer__header-overlay" />

          <button className="profile-drawer__close" onClick={close} aria-label="Close profile">
            <X size={14} />
          </button>

          <div className="profile-drawer__avatar-wrap">
            <div
              className="profile-drawer__avatar"
              style={{ background: USER.avatarGrad }}
            >
              {USER.initials}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="profile-drawer__body">

          {/* Name & handle */}
          <h2 className="profile-drawer__name">{USER.name}</h2>
          <p className="profile-drawer__handle">{USER.handle} · Joined {USER.joined}</p>

          {/* Rank badge */}
          <div
            className="profile-drawer__rank-badge"
            style={{
              color: rank.color,
              background: rank.color + '18',
              borderColor: rank.color + '33',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{rank.icon}</span>
            <span>{rank.name}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>·</span>
            <ShoppingBag size={11} style={{ opacity: 0.6 }} />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.7rem' }}>Vibe Coder</span>
          </div>

          {/* XP progress */}
          <div className="profile-drawer__xp-section">
            <div className="profile-drawer__xp-label">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                XP Progress
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: rank.color }}>
                {xp} / {nextRank?.minXP ?? '∞'} XP
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
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 6, fontSize: '0.65rem', color: 'var(--text-muted)',
            }}>
              <span>{rank.name}</span>
              {nextRank && <span>Next: {nextRank.name} {nextRank.icon}</span>}
            </div>
          </div>

          {/* Stats grid */}
          <p className="profile-drawer__section-title">Activity</p>
          <div className="profile-drawer__stats-grid">
            {[
              { value: USER.gigs,   label: 'Gigs Listed' },
              { value: USER.orders, label: 'Orders'      },
              { value: USER.posts,  label: 'Posts'       },
            ].map(({ value, label }) => (
              <div className="profile-drawer__stat-card" key={label}>
                <div className="profile-drawer__stat-value">{value}</div>
                <div className="profile-drawer__stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Islands */}
          <p className="profile-drawer__section-title">My Islands</p>
          <div className="profile-drawer__islands">
            {USER.islands.map(isl => {
              const chip = ISLAND_CHIP_COLORS[isl] ?? ISLAND_CHIP_COLORS.Sports;
              return (
                <span
                  key={isl}
                  className="profile-drawer__island-chip"
                  style={{ color: chip.color, background: chip.bg }}
                >
                  {chip.icon}
                  {isl}
                </span>
              );
            })}
          </div>

          {/* Skeleton placeholder rows for future content */}
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

        {/* ── Footer actions ── */}
        <div className="profile-drawer__footer">
          <button className="profile-drawer__btn profile-drawer__btn--primary">
            Edit Profile
          </button>
          <button className="profile-drawer__btn profile-drawer__btn--secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, flex: '0 0 auto', padding: '10px 16px' }}>
            <Settings size={14} />
          </button>
          <button className="profile-drawer__btn profile-drawer__btn--secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, flex: '0 0 auto', padding: '10px 16px' }}>
            <Share2 size={14} />
          </button>
        </div>
      </aside>
    </>
  );
}
