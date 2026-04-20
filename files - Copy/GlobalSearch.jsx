import { useState, useEffect, useRef, useCallback } from 'react';
import useStore from '../../store/useStore';
import useGamification from '../../hooks/useGamification';

// ─── Mock data corpus ──────────────────────────────────────────────────────────
const ALL_RESULTS = {
  communities: [
    { id: 'c1', name: 'Nairobi Fitness Collective', island: 'Sports', members: 2840, icon: '⚡', desc: 'Elite trainers & athletes pushing limits daily' },
    { id: 'c2', name: 'The Beauty Vault', island: 'Beauty', members: 5120, icon: '✨', desc: 'Kenya\'s top beauty professionals & creatives' },
    { id: 'c3', name: 'EduKenya Pro', island: 'Education', members: 7300, icon: '📚', desc: 'KCSE tutors, lecturers & curriculum designers' },
    { id: 'c4', name: 'Pitch & Hustle FC', island: 'Sports', members: 1200, icon: '⚽', desc: 'Grassroots football community & coaching network' },
    { id: 'c5', name: 'Curl Theory Studio', island: 'Beauty', members: 980, icon: '💅', desc: 'Natural hair specialists across East Africa' },
    { id: 'c6', name: 'Code & Quill', island: 'Education', members: 3400, icon: '💻', desc: 'Tech & creative writing mentorship collective' },
  ],
  freelancers: [
    { id: 'f1', name: 'Amina S.', island: 'Beauty', xp: 5500, role: 'Brand Designer & Loctician', badge: '✅', completedGigs: 214 },
    { id: 'f2', name: 'Wanjiku M.', island: 'Education', xp: 3200, role: 'KCSE Tutor & Curriculum Dev', badge: '✅', completedGigs: 178 },
    { id: 'f3', name: 'Omondi K.', island: 'Sports', xp: 720, role: 'Personal Trainer & Coach', badge: '✅', completedGigs: 53 },
    { id: 'f4', name: 'Njeri W.', island: 'Education', xp: 2100, role: 'IELTS Coach & ESL Educator', badge: '✅', completedGigs: 92 },
    { id: 'f5', name: 'Brian O.', island: 'Sports', xp: 450, role: 'Fitness & Nutrition Specialist', badge: '', completedGigs: 31 },
    { id: 'f6', name: 'Zawadi T.', island: 'Beauty', xp: 1500, role: 'Makeup Artist & Skincare Pro', badge: '✅', completedGigs: 67 },
  ],
  gigs: [
    { id: 'g1', title: 'Professional Brand Identity Package', island: 'Beauty', price: 8450, seller: 'Amina S.', rating: 4.9, orders: 127, emoji: '🎨' },
    { id: 'g2', title: 'KCSE Math Crash Course — Full Syllabus', island: 'Education', price: 5850, seller: 'Wanjiku M.', rating: 5.0, orders: 214, emoji: '📐' },
    { id: 'g3', title: '12-Week Personal Training Programme', island: 'Sports', price: 12000, seller: 'Omondi K.', rating: 4.7, orders: 53, emoji: '🏋️' },
    { id: 'g4', title: 'Natural Locs Installation & Retwist', island: 'Beauty', price: 7150, seller: 'Zawadi T.', rating: 4.8, orders: 67, emoji: '💆' },
    { id: 'g5', title: 'IELTS Band 7+ Coaching Bundle', island: 'Education', price: 7800, seller: 'Njeri W.', rating: 4.9, orders: 92, emoji: '📖' },
    { id: 'g6', title: 'Sports Nutrition & Meal Plan Design', island: 'Sports', price: 3640, seller: 'Brian O.', rating: 4.6, orders: 31, emoji: '🥗' },
  ],
};

const ISLAND_ACCENT = {
  Sports:    { color: '#ea580c', bg: 'rgba(234,88,12,0.12)' },
  Beauty:    { color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  Education: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function CommunityResult({ item }) {
  const accent = ISLAND_ACCENT[item.island] ?? ISLAND_ACCENT.Sports;
  return (
    <div style={styles.resultRow} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ ...styles.resultIcon, background: accent.bg, color: accent.color }}>{item.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={styles.resultTitle}>{item.name}</span>
          <span style={{ ...styles.islandPill, color: accent.color, background: accent.bg }}>{item.island}</span>
        </div>
        <span style={styles.resultSub}>{item.members.toLocaleString()} members · {item.desc}</span>
      </div>
      <button style={styles.joinBtn}>Join</button>
    </div>
  );
}

function FreelancerResult({ item }) {
  const { rank } = useGamification(item.xp);
  const accent = ISLAND_ACCENT[item.island] ?? ISLAND_ACCENT.Sports;
  return (
    <div style={styles.resultRow} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ ...styles.avatarCircle, background: `linear-gradient(135deg, ${accent.color}88, ${accent.color})` }}>
        {item.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={styles.resultTitle}>{item.name}</span>
          {item.badge && <span style={{ fontSize: '0.7rem', color: '#52b788' }}>✅ Verified</span>}
          <span style={{ ...styles.rankPill, color: rank.color, background: rank.color + '1a' }}>
            {rank.icon} {rank.name}
          </span>
        </div>
        <span style={styles.resultSub}>{item.role} · {item.completedGigs} gigs completed</span>
      </div>
      <button style={styles.viewBtn}>View</button>
    </div>
  );
}

function GigResult({ item }) {
  const accent = ISLAND_ACCENT[item.island] ?? ISLAND_ACCENT.Sports;
  return (
    <div style={styles.resultRow} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ ...styles.resultIcon, fontSize: 20, background: accent.bg }}>{item.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={styles.resultTitle}>{item.title}</span>
        </div>
        <span style={styles.resultSub}>
          by {item.seller} · ⭐ {item.rating} ({item.orders}) · {item.island}
        </span>
      </div>
      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#52b788', whiteSpace: 'nowrap', marginLeft: 8 }}>
        KES {item.price.toLocaleString()}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function GlobalSearch({ isOpen, onClose }) {
  const { activeIsland } = useStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery('');
      setActiveFilter('All');
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const filterByIslandAndQuery = useCallback((items, extraKey = 'name') => {
    return items.filter(item => {
      const matchIsland = activeFilter === 'All' || item.island === activeFilter;
      const matchQuery = !query || (
        item[extraKey]?.toLowerCase().includes(query.toLowerCase()) ||
        item.island?.toLowerCase().includes(query.toLowerCase())
      );
      return matchIsland && matchQuery;
    });
  }, [query, activeFilter]);

  const communities = filterByIslandAndQuery(ALL_RESULTS.communities);
  const freelancers = filterByIslandAndQuery(ALL_RESULTS.freelancers, 'name');
  const gigs = filterByIslandAndQuery(ALL_RESULTS.gigs, 'title');
  const totalResults = communities.length + freelancers.length + gigs.length;

  const FILTERS = ['All', 'Sports', 'Beauty', 'Education'];

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={e => e.stopPropagation()}>

        {/* ── Search input bar ── */}
        <div style={styles.searchBar}>
          <span style={{ fontSize: 18, color: '#5a7260', flexShrink: 0 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search in ${activeIsland} island…`}
            style={styles.searchInput}
          />
          {query && (
            <button onClick={() => setQuery('')} style={styles.clearBtn}>✕</button>
          )}
          <kbd style={styles.escKbd} onClick={onClose}>ESC</kbd>
        </div>

        {/* ── Island filter chips ── */}
        <div style={styles.filterRow}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f;
            const accent = f !== 'All' ? ISLAND_ACCENT[f] : null;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  ...styles.filterChip,
                  background: isActive ? (accent?.bg ?? 'rgba(82,183,136,0.15)') : 'rgba(255,255,255,0.04)',
                  color: isActive ? (accent?.color ?? '#52b788') : '#a3b899',
                  border: `1px solid ${isActive ? (accent?.color ?? '#52b788') + '44' : 'rgba(255,255,255,0.07)'}`,
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {f === 'All' ? '🌍' : f === 'Sports' ? '⚡' : f === 'Beauty' ? '✨' : '📚'} {f}
              </button>
            );
          })}
          <span style={{ marginLeft: 'auto', fontSize: '0.73rem', color: '#5a7260', alignSelf: 'center' }}>
            {totalResults} result{totalResults !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Results body ── */}
        <div style={styles.resultsBody}>
          {totalResults === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
              <p style={{ color: '#a3b899', fontSize: '0.9rem', fontWeight: 600 }}>No results in this island yet</p>
              <p style={{ color: '#5a7260', fontSize: '0.8rem', marginTop: 4 }}>Try switching islands or broadening your search</p>
            </div>
          ) : (
            <>
              {/* Top Communities */}
              {communities.length > 0 && (
                <Section title="Top Communities" count={communities.length} icon="🌿">
                  {communities.slice(0, 3).map(item => <CommunityResult key={item.id} item={item} />)}
                </Section>
              )}

              {/* Verified Freelancers */}
              {freelancers.length > 0 && (
                <Section title="Verified Freelancers" count={freelancers.length} icon="🦋">
                  {freelancers.slice(0, 3).map(item => <FreelancerResult key={item.id} item={item} />)}
                </Section>
              )}

              {/* Trending Gigs */}
              {gigs.length > 0 && (
                <Section title="Trending Gigs" count={gigs.length} icon="🔥">
                  {gigs.slice(0, 3).map(item => <GigResult key={item.id} item={item} />)}
                </Section>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={styles.footer}>
          <span style={{ fontSize: '0.72rem', color: '#5a7260' }}>
            Searching within <span style={{ color: '#52b788', fontWeight: 700 }}>{activeFilter === 'All' ? 'all islands' : activeFilter + ' island'}</span>
          </span>
          <button style={styles.browseAllBtn}>Browse all results →</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, count, icon, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={styles.sectionHeader}>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span style={styles.sectionTitle}>{title}</span>
        <span style={styles.sectionCount}>{count}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(5, 12, 8, 0.82)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    paddingTop: '8vh',
    animation: 'fadeIn 0.15s ease',
  },
  panel: {
    width: '100%', maxWidth: 680,
    background: '#111f17',
    border: '1px solid rgba(82,183,136,0.18)',
    borderRadius: 18,
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(82,183,136,0.06)',
    overflow: 'hidden',
    animation: 'slideDown 0.2s cubic-bezier(0.16,1,0.3,1)',
    maxHeight: '80vh',
    display: 'flex', flexDirection: 'column',
  },
  searchBar: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  searchInput: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#e8f0eb', fontSize: '1.05rem',
    fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
    caretColor: '#52b788',
  },
  clearBtn: {
    background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
    width: 22, height: 22, cursor: 'pointer', color: '#a3b899',
    fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  escKbd: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6, padding: '2px 7px', fontSize: '0.65rem', color: '#5a7260',
    cursor: 'pointer', fontFamily: 'monospace', flexShrink: 0,
  },
  filterRow: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '10px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    flexShrink: 0, flexWrap: 'wrap',
  },
  filterChip: {
    padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem',
    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
  },
  resultsBody: {
    overflowY: 'auto', flex: 1,
    padding: '10px 8px',
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '8px 12px 4px',
  },
  sectionTitle: {
    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#5a7260',
  },
  sectionCount: {
    background: 'rgba(82,183,136,0.12)', color: '#52b788',
    fontSize: '0.65rem', fontWeight: 700,
    padding: '1px 7px', borderRadius: 20, marginLeft: 2,
  },
  resultRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '9px 12px', borderRadius: 10,
    cursor: 'pointer', transition: 'background 0.12s',
  },
  resultIcon: {
    width: 38, height: 38, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
  },
  avatarCircle: {
    width: 38, height: 38, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
  },
  resultTitle: {
    fontSize: '0.87rem', fontWeight: 600, color: '#e8f0eb',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  resultSub: {
    fontSize: '0.75rem', color: '#5a7260', display: 'block',
    marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  islandPill: {
    fontSize: '0.62rem', fontWeight: 700, padding: '1px 7px',
    borderRadius: 20, flexShrink: 0,
  },
  rankPill: {
    fontSize: '0.62rem', fontWeight: 700, padding: '1px 7px',
    borderRadius: 20, flexShrink: 0,
  },
  joinBtn: {
    padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(82,183,136,0.3)',
    background: 'rgba(82,183,136,0.08)', color: '#52b788',
    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
    flexShrink: 0, whiteSpace: 'nowrap', transition: 'all 0.15s',
  },
  viewBtn: {
    padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)', color: '#a3b899',
    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
    flexShrink: 0, whiteSpace: 'nowrap', transition: 'all 0.15s',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '48px 20px', textAlign: 'center',
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 18px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    flexShrink: 0,
    background: 'rgba(0,0,0,0.15)',
  },
  browseAllBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#52b788', fontSize: '0.75rem', fontWeight: 700,
  },
};
