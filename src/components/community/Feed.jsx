import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { getRank } from '../../store/useStore';
import { POSTS, ISLAND_META } from '../../data/registry';
import IslandHeader from './IslandHeader';

// ─── Framer Motion variants for post cards ────────────────────────────────────
const postVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.055, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: {
    opacity: 0, x: -12,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
};

// ─── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({ post, index }) {
  const [liked,       setLiked]       = useState(false);
  const [reposted,    setReposted]    = useState(false);
  const [likeCount,   setLikeCount]   = useState(post.likes);
  const [repostCount, setRepostCount] = useState(post.reposts);

  // Derive rank from authorXP using the shared helper — no separate hook needed
  const rank        = getRank(post.authorXP);
  const islandMeta  = ISLAND_META[post.island];
  const islandColor = islandMeta?.color ?? '#52b788';

  const handleLike = () => {
    setLiked(v => !v);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };
  const handleRepost = () => {
    setReposted(v => !v);
    setRepostCount(c => reposted ? c - 1 : c + 1);
  };

  return (
    <motion.article
      layout
      key={post.id}
      custom={index}
      variants={postVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ borderBottom: '1px solid var(--border)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ padding: '18px 20px', display: 'flex', gap: 13, transition: 'background 0.15s' }}>
        {/* Avatar */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: post.avatarGrad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          {post.avatar}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {post.author}
            </span>
            {/* Live rank badge — derived from authorXP via getRank */}
            <span style={{
              fontSize: '0.67rem', fontWeight: 700,
              color: rank.color, background: rank.color + '1a',
              padding: '1px 7px', borderRadius: 20,
            }}>
              {rank.icon} {rank.name}
            </span>
            {/* Island tag */}
            <span style={{
              fontSize: '0.67rem', fontWeight: 700,
              color: islandColor,
              background: islandColor + '1a',
              padding: '1px 7px', borderRadius: 20,
            }}>
              {post.island}
            </span>
            {/* Thread indicator */}
            {post.isThread && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: 'var(--accent-2)', background: 'rgba(245,158,11,0.1)',
                padding: '1px 7px', borderRadius: 20,
                border: '1px solid rgba(245,158,11,0.2)',
              }}>
                Thread 🧵
              </span>
            )}
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {post.time}
            </span>
          </div>

          {/* Post body */}
          <p style={{
            fontSize: '0.88rem', color: 'var(--text-primary)',
            lineHeight: 1.65, marginBottom: 12,
            whiteSpace: 'pre-line', wordBreak: 'break-word',
          }}>
            {post.content}
          </p>

          {/* Action row */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[
              { icon: '💬', count: post.comments, active: false,    color: '#3b82f6', onClick: () => {}      },
              { icon: reposted ? '🔁' : '↩️', count: repostCount,  active: reposted, color: '#22c55e', onClick: handleRepost },
              { icon: liked   ? '❤️' : '🤍',  count: likeCount,    active: liked,    color: '#ef4444', onClick: handleLike   },
            ].map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: action.active ? action.color : 'var(--text-muted)',
                  fontSize: '0.8rem', fontWeight: 600,
                  padding: '5px 9px', borderRadius: 8,
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover-bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                <span>{action.icon}</span>
                <span>{action.count}</span>
              </button>
            ))}
            <button style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-muted)',
              fontSize: '0.9rem', padding: '5px 9px', borderRadius: 8,
            }}>
              ···
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
export default function Feed() {
  // Read both filter dimensions directly from the store —
  // no prop-drilling needed; Feed is fully self-contained.
  const { activeIsland, searchQuery } = useStore();

  const [composing, setComposing] = useState(false);
  const [draft,     setDraft]     = useState('');

  // ── Dual filter: island + searchQuery ───────────────────────────────────────
  // Island filter: if activeIsland is set, only show posts from that island.
  // Search filter: match against author name or post content.
  const q = searchQuery.toLowerCase().trim();

  const filtered = POSTS.filter(post => {
    const matchesIsland = !activeIsland || post.island === activeIsland;
    const matchesSearch = q.length === 0
      || post.content.toLowerCase().includes(q)
      || post.author.toLowerCase().includes(q)
      || post.island.toLowerCase().includes(q);
    return matchesIsland && matchesSearch;
  });

  const accentColor = ISLAND_META[activeIsland]?.color ?? 'var(--accent)';

  return (
    <div style={{ flex: 1, maxWidth: 640 }}>

      {/* ── IslandHeader — self-contained, reads activeIsland from store ── */}
      <IslandHeader />

      {/* ── Compose box ── */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', gap: 12,
        background: 'var(--card-bg)',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#fff',
        }}>
          K
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            placeholder={`Share something with the ${activeIsland} community…`}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onFocus={() => setComposing(true)}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              outline: 'none', resize: 'none', fontSize: '0.9rem',
              color: 'var(--text-primary)', minHeight: composing ? 80 : 36,
              transition: 'min-height 0.2s ease',
              fontFamily: 'var(--font-body)', lineHeight: 1.5,
            }}
          />
          {composing && (
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 8,
              paddingTop: 8, borderTop: '1px solid var(--border)',
            }}>
              <button
                onClick={() => { setComposing(false); setDraft(''); }}
                style={{
                  padding: '6px 14px', borderRadius: 20,
                  border: '1px solid var(--border)',
                  background: 'none', cursor: 'pointer',
                  fontSize: '0.8rem', color: 'var(--text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setComposing(false); setDraft(''); }}
                style={{
                  padding: '6px 18px', borderRadius: 20, border: 'none',
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                  boxShadow: `0 2px 12px ${accentColor}33`,
                }}
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Post list with AnimatePresence for filter transitions ── */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '0 0 14px 14px',
        border: '1px solid var(--border)',
        borderTop: 'none',
        overflow: 'hidden',
      }}>
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>🌱</div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: 6,
              }}>
                {q ? `No posts match "${searchQuery}"` : 'Nothing here yet'}
              </p>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
                {q
                  ? `Try a different search term or switch islands.`
                  : `Be the first to share something with the ${activeIsland} community.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
