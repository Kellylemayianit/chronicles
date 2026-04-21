import { useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Users, Zap, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';
import { TRENDING_GIGS, TOP_ISLANDERS } from '../../data/registry';

const ISLAND_ICONS = { Sports: Zap, Beauty: Sparkles, Education: BookOpen };

// ─── Component ────────────────────────────────────────────────────────────────
export default function GlobalSearch() {
  const {
    isSearchOpen, setIsSearchOpen,
    searchQuery,  setSearchQuery,
  } = useStore();

  const inputRef = useRef(null);

  // Auto-focus when opened; clear query when closed
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen, setSearchQuery]);

  // Escape key closes overlay
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setIsSearchOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  // ── Live filter against registry data ────────────────────────────────────────
  const q = searchQuery.toLowerCase();

  const filteredGigs = q.length > 1
    ? TRENDING_GIGS.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.island.toLowerCase().includes(q))
    : TRENDING_GIGS;

  const filteredIslanders = q.length > 1
    ? TOP_ISLANDERS.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.island.toLowerCase().includes(q))
    : TOP_ISLANDERS;

  return (
    <>
      {/* ── Full-screen blurred backdrop ── */}
      <div
        className="overlay-backdrop"
        style={{ zIndex: 299 }}
        onClick={() => setIsSearchOpen(false)}
      />

      {/* ── Search overlay ── */}
      <div className="global-search-overlay" style={{ zIndex: 300 }}>

        {/* Input box */}
        <div className="global-search-box">
          <div className="global-search-input-wrap">
            <Search size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              className="global-search-input"
              placeholder="Search gigs, islanders, topics…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery.length > 0 ? (
              <button
                onClick={() => setSearchQuery('')}
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

          {/* Quick-filter pills */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['All', 'Gigs', 'Islanders', 'Sports', 'Beauty', 'Education'].map(tag => {
              const isActive = tag === 'All' ? searchQuery === '' : searchQuery === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag === 'All' ? '' : tag)}
                  style={{
                    padding: '4px 12px', borderRadius: 20,
                    background: isActive ? 'rgba(82,183,136,0.12)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isActive ? 'rgba(82,183,136,0.35)' : 'rgba(255,255,255,0.09)'}`,
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    fontSize: '0.72rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(82,183,136,0.08)';
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.borderColor = 'rgba(82,183,136,0.2)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                    }
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Two-column results ── */}
        <div className="global-search-results">

          {/* Column 1: Trending Gigs — sourced from registry.js */}
          <div className="global-search-col">
            <div className="global-search-col__header">
              <TrendingUp size={13} style={{ color: 'var(--accent-2)' }} />
              <span className="global-search-col__title">Trending Gigs</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {filteredGigs.length} result{filteredGigs.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredGigs.length > 0 ? filteredGigs.map(gig => {
              const IslandIcon = ISLAND_ICONS[gig.island] ?? Zap;
              return (
                <div key={gig.id} className="global-search-item">
                  <div className="global-search-item__thumb" style={{ background: gig.islandBg }}>
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
                No gigs match "{searchQuery}"
              </div>
            )}

            {filteredGigs.length > 0 && (
              <div
                onClick={() => setIsSearchOpen(false)}
                style={{
                  padding: '10px 16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6, cursor: 'pointer',
                  borderTop: '1px solid var(--border)',
                  color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700,
                }}
              >
                Browse all gigs <ArrowRight size={12} />
              </div>
            )}
          </div>

          {/* Column 2: Top Islanders — sourced from registry.js */}
          <div className="global-search-col">
            <div className="global-search-col__header">
              <Users size={13} style={{ color: 'var(--island-sports-color)' }} />
              <span className="global-search-col__title">Top Islanders</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {filteredIslanders.length} result{filteredIslanders.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredIslanders.length > 0 ? filteredIslanders.map(user => {
              const IslandIcon = ISLAND_ICONS[user.island] ?? Zap;
              return (
                <div key={user.id} className="global-search-item">
                  <div className="global-search-item__avatar" style={{ background: user.grad }}>
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
                No islanders match "{searchQuery}"
              </div>
            )}

            {filteredIslanders.length > 0 && (
              <div style={{
                padding: '10px 16px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6, cursor: 'pointer',
                borderTop: '1px solid var(--border)',
                color: 'var(--island-sports-color)', fontSize: '0.75rem', fontWeight: 700,
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
