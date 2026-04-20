import { useState } from 'react';
import useGamification from '../../hooks/useGamification';
import IslandHeader from './IslandHeader';

const SAMPLE_POSTS = [
  {
    id: 1,
    author: 'Wanjiku M.',
    authorXP: 3200,
    island: 'Education',
    time: '2m ago',
    content: 'Just completed the Canopy-level challenge on Digital Marketing! The community resources here are genuinely transformative. Who else is on this track? 🌲',
    likes: 42,
    comments: 11,
    reposts: 7,
    avatar: 'W',
    avatarGrad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  },
  {
    id: 2,
    author: 'Omondi K.',
    authorXP: 720,
    island: 'Sports',
    time: '18m ago',
    content: 'Offering personal training sessions — 6AM slots available in Westlands. DM or find my gig on the Marketplace. First session free for Grove members and above! ⚡',
    likes: 89,
    comments: 23,
    reposts: 14,
    avatar: 'O',
    avatarGrad: 'linear-gradient(135deg, #ea580c, #facc15)',
  },
  {
    id: 3,
    author: 'Amina S.',
    authorXP: 5500,
    island: 'Beauty',
    time: '1h ago',
    content: 'Thread: How I scaled my braiding studio from 2 clients/week to 30 using Kimana. 🧵👇\n\n1/ The biggest unlock was the Community Feed. I stopped thinking about "posts" and started sharing genuine behind-the-scenes value.',
    likes: 214,
    comments: 67,
    reposts: 55,
    avatar: 'A',
    avatarGrad: 'linear-gradient(135deg, #a855f7, #ec4899)',
    isThread: true,
  },
];

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const { rank } = useGamification(post.authorXP);

  const ISLAND_COLORS = {
    Sports:    '#ea580c',
    Beauty:    '#a855f7',
    Education: '#3b82f6',
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setRepostCount(reposted ? repostCount - 1 : repostCount + 1);
  };

  return (
    <article
      style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 13,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Avatar */}
      <div style={{
        width: 42, height: 42, borderRadius: '50%',
        background: post.avatarGrad,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}>
        {post.avatar}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{post.author}</span>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700,
            color: rank.color, background: rank.color + '1a',
            padding: '1px 7px', borderRadius: 20,
          }}>
            {rank.icon} {rank.name}
          </span>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700,
            color: ISLAND_COLORS[post.island] ?? 'var(--accent)',
            background: (ISLAND_COLORS[post.island] ?? 'var(--accent)') + '18',
            padding: '1px 7px', borderRadius: 20,
          }}>
            {post.island}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{post.time}</span>
        </div>

        {/* Post body */}
        <p style={{
          fontSize: '0.88rem', color: 'var(--text-primary)',
          lineHeight: 1.6, marginBottom: 12,
          whiteSpace: 'pre-line', wordBreak: 'break-word',
        }}>
          {post.content}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {[
            { icon: '💬', count: post.comments, active: false, color: '#3b82f6', onClick: () => {} },
            { icon: reposted ? '🔁' : '↩️', count: repostCount, active: reposted, color: '#22c55e', onClick: handleRepost },
            { icon: liked ? '❤️' : '🤍',    count: likeCount,   active: liked,    color: '#ef4444', onClick: handleLike },
          ].map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: 'none', cursor: 'pointer',
                color: action.active ? action.color : 'var(--text-muted)',
                fontSize: '0.8rem', fontWeight: 600,
                padding: '4px 8px', borderRadius: 8,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span>{action.icon}</span>
              <span>{action.count}</span>
            </button>
          ))}
          <button style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem',
            padding: '4px 8px', borderRadius: 8,
          }}>
            ···
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
export default function Feed({ activeIsland = 'All' }) {
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');

  const filtered = activeIsland === 'All'
    ? SAMPLE_POSTS
    : SAMPLE_POSTS.filter(p => p.island === activeIsland);

  return (
    <div style={{ flex: 1, maxWidth: 620 }}>

      {/* ── Island Header banner ── */}
      {activeIsland && activeIsland !== 'All' && (
        <IslandHeader island={activeIsland} />
      )}

      {/* ── Compose box ── */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', gap: 12,
        background: 'var(--card-bg)',
        borderRadius: activeIsland === 'All' ? '12px 12px 0 0' : '0',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>
          K
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            placeholder="Share something with the community…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onFocus={() => setComposing(true)}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              outline: 'none', resize: 'none', fontSize: '0.9rem',
              color: 'var(--text-primary)', minHeight: composing ? 80 : 38,
              transition: 'min-height 0.2s ease',
              fontFamily: 'var(--font-body)', lineHeight: 1.5,
            }}
          />
          {composing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => { setComposing(false); setDraft(''); }}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)',
                  background: 'none', cursor: 'pointer', fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setComposing(false); setDraft(''); }}
                style={{
                  padding: '6px 18px', borderRadius: 20, border: 'none',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                }}
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Posts ── */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '0 0 12px 12px',
        border: '1px solid var(--border)',
        borderTop: 'none',
        overflow: 'hidden',
      }}>
        {filtered.length > 0
          ? filtered.map(post => <PostCard key={post.id} post={post} />)
          : (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No posts in this island yet. Be the first to share! 🌱
            </div>
          )
        }
      </div>
    </div>
  );
}
