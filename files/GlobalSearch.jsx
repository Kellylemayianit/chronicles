import { useEffect, useRef, useState } from 'react';
import { Search, X, TrendingUp, Users, Zap, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';

// ─── Static skeleton data ─────────────────────────────────────────────────────
const TRENDING_GIGS = [
  { id: 't1', emoji: '🎨', title: 'Professional Logo Design',     island: 'Beauty',    price: 'KES 6,370',  rating: '4.9', islandColor: 'var(--island-beauty-color)',    islandBg: 'var(--island-beauty-bg)'    },
  { id: 't2', emoji: '⚽', title: 'Sports Coaching Session',       island: 'Sports',    price: 'KES 4,550',  rating: '4.7', islandColor: 'var(--island-sports-color)',    islandBg: 'var(--island-sports-bg)'    },
  { id: 't3', emoji: '📚', title: 'Curriculum Design & Tutoring', island: 'Education', price: 'KES 7,800',  rating: '5.0', islandColor: 'var(--island-education-color)', islandBg: 'var(--island-education-bg)' },
  { id: 't4', emoji: '✨', title: 'Island Beauty Pack',            island: 'Beauty',    price: 'KES 11,050', rating: '4.8', islandColor: 'var(--island-beauty-color)',    islandBg: 'var(--island-beauty-bg)'    },
  { id: 't5', emoji: '🏷️', title: 'Brand Identity Full Package',  island: 'Sports',    price: 'KES 15,600', rating: '4.9', islandColor: 'var(--island-sports-color)',    islandBg: 'var(--island-sports-bg)'    },
];

const TOP_ISLANDERS = [
  { id: 'u1', initials: 'A', name: 'Amina S.',    handle: '@aminas',   xpLabel: '5,500 XP', rank: '🌳 Canopy',  island: 'Beauty',    grad: 'linear-gradient(135deg,#a855f7,#ec4899)', islandColor: 'var(--island-beauty-color)'    },
  { id: 'u2', initials: 'O', name: 'Otieno K.',   handle: '@otienok',  xpLabel: '3,100 XP', rank: '🌿 Sprout',  island: 'Sports',    grad: 'linear-gradient(135deg,#ea580c,#facc15)', islandColor: 'var(--island-sports-color)'    },
  { id: 'u3', initials: 'W', name: 'Wanjiku M.',  handle: '@wanjikum', xpLabel: '3,200 XP', rank: '🌿 Sprout',  island: 'Education', grad: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', islandColor: 'var(--island-education-color)' },
  { id: 'u4', initials: 'N', name: 'Njeri W.',    handle: '@njeriw',   xpLabel: '980 XP',   rank: '🌱 Seedling',island: 'Education', grad: 'linear-gradient(135deg,#22c55e,#3b82f6)', islandColor: 'var(--island-education-color)' },
  { id: 'u5', initials: 'B', name: 'Brian O.',    handle: '@briano',   xpLabel: '650 XP',   rank: '🌱 Seedling',island: 'Sports',    grad: 'linear-gradient(135deg,#f97316,#ea580c)', islandColor: 'var(--island-sports-color)'    },
];

const ISLAND_ICONS = { Sports: Zap, Beauty: Sparkles, Education: BookOpen };

// ─── Component ────────────────────────────────────────────────────────────────
export default function GlobalSearch() {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Auto-focus when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard: Escape closes
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  // Filter results based on query (skeleton: just filter by name contains)
  const filteredGigs = query.length > 1
    ? TRENDING_GIGS.filter(g => g.title.toLowerCase().includes(query.toLowerCase()) || g.island.toLowerCase().includes(query.toLowerCase()))
    : TRENDING_GIGS;

  const filteredIslanders = query.length > 1
    ? TOP_ISLANDERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.island.toLowerCase().includes(query.toLowerCase()))
    : TOP_ISLANDERS;

  return (
    <>
      {/* Full-screen blurred backdrop */}
      <div
        className="overlay-backdrop"
        style={{ zIndex: 299 }}
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Search overlay */}
      <div className="global-search-overlay" style={{ zIndex: 300 }}>

        {/* ── Search input box ── */}
        <div className="global-search-box">
          <div className="global-search-input-wrap">
            <Search size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              className="global-search-input"
              placeholder="Search gigs, islanders, topics…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query.length > 0 ? (
              <button
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
              >
                <X size={15} />
              </button>
            ) : (
              <span className="global-search-kbd">ESC</span>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                borderRadius: '50%', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0,
              }}
            >
              <X size={13} />
            </button>
          </div>

          {/* Quick filters */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
            {['All', 'Gigs', 'Islanders', 'Sports', 'Beauty', 'Education'].map(tag => (
              <button
                key={tag}
                style={{
                  padding: '4px 12px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(82,183,136,0.1)';
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.borderColor = 'rgba(82,183,136,0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                }}
                onClick={() => setQuery(tag === 'All' ? '' : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Two-column results ── */}
        <div className="global-search-results">

          {/* ── Column 1: Trending Gigs ── */}
          <div className="global-search-col">
            <div className="global-search-col__header">
              <TrendingUp size={13} style={{ color: 'var(--accent-2)' }} />
              <span className="global-search-col__title">Trending Gigs</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {filteredGigs.length} results
              </span>
            </div>

            {filteredGigs.length > 0 ? filteredGigs.map(gig => {
              const IslandIcon = ISLAND_ICONS[gig.island] ?? Zap;
              return (
                <div key={gig.id} className="global-search-item">
                  <div
                    className="global-search-item__thumb"
                    style={{ background: gig.islandBg }}
                  >
                    {gig.emoji}
                  </div>
                  <div className="global-search-item__info">
                    <div className="global-search-item__name">{gig.title}</div>
                    <div className="global-search-item__sub">
                      <IslandIcon size={10} style={{ display: 'inline', marginRight: 3, color: gig.islandColor }} />
                      {gig.island} · ⭐ {gig.rating}
                    </div>
                  </div>
                  <span
                    className="global-search-item__badge"
                    style={{ color: 'var(--accent)', background: 'rgba(82,183,136,0.1)' }}
                  >
                    {gig.price}
                  </span>
                </div>
              );
            }) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No gigs match "{query}"
              </div>
            )}

            {filteredGigs.length > 0 && (
              <div style={{
                padding: '10px 16px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
                borderTop: '1px solid var(--border)',
                color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700,
                cursor: 'pointer',
              }}>
                Browse all gigs <ArrowRight size={12} />
              </div>
            )}
          </div>

          {/* ── Column 2: Top Islanders ── */}
          <div className="global-search-col">
            <div className="global-search-col__header">
              <Users size={13} style={{ color: 'var(--island-sports-color)' }} />
              <span className="global-search-col__title">Top Islanders</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {filteredIslanders.length} results
              </span>
            </div>

            {filteredIslanders.length > 0 ? filteredIslanders.map(user => {
              const IslandIcon = ISLAND_ICONS[user.island] ?? Zap;
              return (
                <div key={user.id} className="global-search-item">
                  <div
                    className="global-search-item__avatar"
                    style={{ background: user.grad }}
                  >
                    {user.initials}
                  </div>
                  <div className="global-search-item__info">
                    <div className="global-search-item__name">{user.name}</div>
                    <div className="global-search-item__sub">
                      <IslandIcon size={10} style={{ display: 'inline', marginRight: 3, color: user.islandColor }} />
                      {user.island} · {user.xpLabel}
                    </div>
                  </div>
                  <span
                    className="global-search-item__badge"
                    style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
                  >
                    {user.rank}
                  </span>
                </div>
              );
            }) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No islanders match "{query}"
              </div>
            )}

            {filteredIslanders.length > 0 && (
              <div style={{
                padding: '10px 16px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
                borderTop: '1px solid var(--border)',
                color: 'var(--island-sports-color)', fontSize: '0.75rem', fontWeight: 700,
                cursor: 'pointer',
              }}>
                View all islanders <ArrowRight size={12} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
