import { useEffect } from 'react';
import useStore from './store/useStore';
import useGamification from './hooks/useGamification';
import Sidebar from './components/layout/Sidebar';
import GigCard from './components/marketplace/GigCard';
import Feed from './components/community/Feed';

// ─── CSS-in-JS Theme injection ───────────────────────────────────────────────
const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --font-display: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;

    --bg:              #0e1812;
    --sidebar-bg:      #0a1410;
    --sidebar-footer-bg: #091210;
    --card-bg:         #111f17;
    --hover-bg:        rgba(255,255,255,0.04);
    --active-bg:       rgba(82,183,136,0.12);
    --island-active-bg: rgba(245,158,11,0.1);
    --border:          rgba(255,255,255,0.07);

    --accent:          #52b788;
    --accent-2:        #f59e0b;
    --glow:            rgba(82,183,136,0.3);

    --text-primary:    #e8f0eb;
    --text-secondary:  #a3b899;
    --text-muted:      #5a7260;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-in { animation: fadeSlideIn 0.3s ease forwards; }
`;

// ─── Gig data ─────────────────────────────────────────────────────────────────
const GIGS = [
  {
    id: 1,
    title: 'I will design a stunning brand identity for your business',
    price: 65,
    sellerName: 'Aisha N.',
    sellerXP: 1800,
    island: 'Beauty',
    rating: 4.9,
    reviewCount: 127,
    imageBg: 'linear-gradient(135deg, #4a1942 0%, #a855f7 100%)',
    deliveryDays: 4,
  },
  {
    id: 2,
    title: 'Professional football coaching for youth teams & academies',
    price: 35,
    sellerName: 'Omondi K.',
    sellerXP: 720,
    island: 'Sports',
    rating: 4.7,
    reviewCount: 53,
    imageBg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    deliveryDays: 1,
  },
  {
    id: 3,
    title: 'Full KCSE Mathematics crash course with exam prep materials',
    price: 45,
    sellerName: 'Wanjiku M.',
    sellerXP: 3200,
    island: 'Education',
    rating: 5.0,
    reviewCount: 214,
    imageBg: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%)',
    deliveryDays: 7,
  },
  {
    id: 4,
    title: 'Natural locs installation, retwisting & loc journey consultation',
    price: 55,
    sellerName: 'Amina S.',
    sellerXP: 5500,
    island: 'Beauty',
    rating: 4.9,
    reviewCount: 98,
    imageBg: 'linear-gradient(135deg, #701a75 0%, #ec4899 100%)',
    deliveryDays: 2,
  },
  {
    id: 5,
    title: 'Personal fitness & nutrition plan tailored for Kenyan lifestyle',
    price: 28,
    sellerName: 'Brian O.',
    sellerXP: 450,
    island: 'Sports',
    rating: 4.6,
    reviewCount: 31,
    imageBg: 'linear-gradient(135deg, #14532d 0%, #52b788 100%)',
    deliveryDays: 3,
  },
  {
    id: 6,
    title: 'IELTS & English proficiency coaching — target band 7+',
    price: 60,
    sellerName: 'Njeri W.',
    sellerXP: 2100,
    island: 'Education',
    rating: 4.8,
    reviewCount: 72,
    imageBg: 'linear-gradient(135deg, #0c4a6e 0%, #38bdf8 100%)',
    deliveryDays: 14,
  },
];

// ─── Rank Progress Bar ─────────────────────────────────────────────────────────
function RankWidget() {
  const { rank, nextRank, progress, xp } = useGamification(240);
  return (
    <div style={{
      background: 'var(--card-bg)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '16px 18px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 22 }}>{rank.icon}</span>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: rank.color }}>{rank.name}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{xp} XP</div>
        </div>
        {nextRank && (
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Next: {nextRank.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{nextRank.minXP - xp} XP away</div>
          </div>
        )}
      </div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 10,
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${rank.color}, var(--accent-2))`,
          transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}

// ─── Marketplace Layout ────────────────────────────────────────────────────────
function MarketplaceLayout({ activeIsland }) {
  const filtered = activeIsland === 'All'
    ? GIGS
    : GIGS.filter(g => g.island === activeIsland);

  return (
    <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxHeight: '100vh' }}>
      <div className="animate-in">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.9rem',
            fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4,
          }}>
            {activeIsland} Marketplace
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {filtered.length} services available in your island
          </p>
        </div>

        {/* Rank widget */}
        <RankWidget />

        {/* Gig grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 18,
        }}>
          {filtered.map(gig => <GigCard key={gig.id} {...gig} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Community Layout ──────────────────────────────────────────────────────────
function CommunityLayout({ activeIsland }) {
  return (
    <div style={{ flex: 1, display: 'flex', overflowY: 'auto', maxHeight: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
        {/* Feed header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(14,24,18,0.85)', backdropFilter: 'blur(12px)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
            {activeIsland} Feed
          </h2>
        </div>
        <Feed island={activeIsland} />
      </div>

      {/* Right sidebar */}
      <aside style={{ width: 280, padding: '20px 18px', flexShrink: 0 }}>
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '16px', marginBottom: 16,
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>
            🏆 Top Growers
          </h3>
          {[
            { name: 'Amina S.', xp: 5500 },
            { name: 'Wanjiku M.', xp: 3200 },
            { name: 'Omondi K.', xp: 720 },
          ].map((u, i) => {
            const { rank } = useGamification(u.xp);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', width: 16 }}>#{i + 1}</span>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fff',
                }}>
                  {u.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                  <div style={{ fontSize: '0.68rem', color: rank.color }}>{rank.icon} {rank.name}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '16px',
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
            🌿 Your Progress
          </h3>
          <RankWidget />
        </div>
      </aside>
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const { activeMode, activeIsland } = useStore();

  // Inject theme CSS once
  useEffect(() => {
    const existing = document.getElementById('kimana-theme');
    if (!existing) {
      const style = document.createElement('style');
      style.id = 'kimana-theme';
      style.textContent = THEME_CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          padding: '12px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(14,24,18,0.9)', backdropFilter: 'blur(12px)',
          flexShrink: 0,
        }}>
          <div style={{
            flex: 1, maxWidth: 360,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            borderRadius: 24, padding: '7px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
            <input
              placeholder={`Search ${activeIsland} ${activeMode}…`}
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: '0.85rem',
                width: '100%', fontFamily: 'var(--font-body)',
              }}
            />
          </div>
          <div style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              padding: '6px 14px', borderRadius: 20,
              background: 'var(--active-bg)',
              fontSize: '0.78rem', fontWeight: 700,
              color: 'var(--accent)',
              border: '1px solid rgba(82,183,136,0.2)',
            }}>
              {activeMode === 'Marketplace' ? '🛍️' : '🌿'} {activeMode}
            </div>
            <div style={{
              padding: '6px 14px', borderRadius: 20,
              background: 'var(--island-active-bg)',
              fontSize: '0.78rem', fontWeight: 700,
              color: 'var(--accent-2)',
              border: '1px solid rgba(245,158,11,0.15)',
            }}>
              ⚡ {activeIsland}
            </div>
          </div>
        </header>

        {/* Mode-based content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {activeMode === 'Marketplace'
            ? <MarketplaceLayout key={activeIsland} activeIsland={activeIsland} />
            : <CommunityLayout key={activeIsland} activeIsland={activeIsland} />
          }
        </div>
      </main>
    </div>
  );
}
