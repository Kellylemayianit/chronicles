import { Zap, Sparkles, BookOpen, Users, TrendingUp } from 'lucide-react';

// ─── Island configuration ─────────────────────────────────────────────────────
const ISLAND_CONFIG = {
  Sports: {
    modifier:    'sports',
    Icon:        Zap,
    emoji:       '⚡',
    eyebrow:     'Island · Active Community',
    description: 'Training, coaching & competition',
    color:       'var(--island-sports-color)',
    bg:          'var(--island-sports-bg)',
    glow:        'var(--island-sports-glow)',
    gradient:    'linear-gradient(135deg, #1a1006 0%, #2d1a08 40%, #3d2010 70%, #1a1006 100%)',
    accentLine:  'linear-gradient(90deg, #ea580c, #f97316, transparent)',
    members:     '12.4k',
    posts:       '3.2k',
  },
  Beauty: {
    modifier:    'beauty',
    Icon:        Sparkles,
    emoji:       '✨',
    eyebrow:     'Island · Creative Hub',
    description: 'Style, wellness & self-expression',
    color:       'var(--island-beauty-color)',
    bg:          'var(--island-beauty-bg)',
    glow:        'var(--island-beauty-glow)',
    gradient:    'linear-gradient(135deg, #150a20 0%, #220e33 40%, #2d1040 70%, #150a20 100%)',
    accentLine:  'linear-gradient(90deg, #a855f7, #c084fc, transparent)',
    members:     '9.1k',
    posts:       '5.7k',
  },
  Education: {
    modifier:    'education',
    Icon:        BookOpen,
    emoji:       '📚',
    eyebrow:     'Island · Knowledge Network',
    description: 'Learning, teaching & growth',
    color:       'var(--island-education-color)',
    bg:          'var(--island-education-bg)',
    glow:        'var(--island-education-glow)',
    gradient:    'linear-gradient(135deg, #080e1f 0%, #0e1a33 40%, #122040 70%, #080e1f 100%)',
    accentLine:  'linear-gradient(90deg, #3b82f6, #60a5fa, transparent)',
    members:     '7.8k',
    posts:       '2.1k',
  },
};

const FALLBACK = ISLAND_CONFIG.Sports;

// ─── Component ────────────────────────────────────────────────────────────────
export default function IslandHeader({ island = 'Sports' }) {
  const cfg = ISLAND_CONFIG[island] ?? FALLBACK;
  const { Icon, modifier, eyebrow, color, bg, gradient, accentLine, members, posts } = cfg;

  return (
    <div className={`island-header island-header--${modifier}`}>
      {/* Layered background */}
      <div
        className="island-header__bg"
        style={{ background: gradient }}
      />

      {/* Subtle noise texture */}
      <div className="island-header__noise" />

      {/* Bottom accent glow line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: accentLine, zIndex: 2, opacity: 0.6,
      }} />

      {/* Corner geometric detail */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 140, height: 140,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        zIndex: 1,
      }} />

      {/* Gradient overlay */}
      <div className="island-header__overlay" />

      {/* Content */}
      <div className="island-header__content">
        <div className="island-header__icon-wrap">
          <Icon size={22} style={{ color }} />
        </div>

        <div className="island-header__meta">
          <div className="island-header__eyebrow" style={{ color }}>
            {eyebrow}
          </div>
          <h2 className="island-header__title">{island}</h2>
          <div className="island-header__stats">
            <span className="island-header__stat">
              <strong>{members}</strong> members
            </span>
            <span className="island-header__stat">
              <strong>{posts}</strong> posts this week
            </span>
          </div>
        </div>

        <span
          className="island-header__pill"
          style={{ color, background: bg }}
        >
          {cfg.emoji} {island}
        </span>
      </div>
    </div>
  );
}
