import { Zap, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { ISLAND_META } from '../../data/registry';

// ─── Icon map (ISLAND_META stores icon name as string to avoid circular deps) ──
const ICON_MAP = { Zap, Sparkles, BookOpen };

// ─── Component ────────────────────────────────────────────────────────────────
// No props required — island is read directly from the store so this component
// stays in sync with any navigation event that calls setActiveIsland().
export default function IslandHeader() {
  const { activeIsland } = useStore();

  const cfg  = ISLAND_META[activeIsland] ?? ISLAND_META.Sports;
  const Icon = ICON_MAP[cfg.icon] ?? Zap;

  const {
    modifier, eyebrow, color, bg, gradient,
    accentLine, members, weekPosts, emoji,
  } = cfg;

  return (
    // AnimatePresence + key on the island name means the whole banner
    // cross-fades whenever the user switches islands via the sidebar.
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIsland}
        className={`island-header island-header--${modifier}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Layered background ── */}
        <div className="island-header__bg" style={{ background: gradient }} />
        <div className="island-header__noise" />

        {/* ── Bottom accent glow line — colour changes with island ── */}
        <motion.div
          key={`line-${activeIsland}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.6 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: accentLine, zIndex: 2,
            transformOrigin: 'left center',
          }}
        />

        {/* ── Corner glow orb ── */}
        <div style={{
          position: 'absolute', top: -20, right: -20, width: 140, height: 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}1a 0%, transparent 70%)`,
          zIndex: 1,
          transition: 'background 0.4s ease',
        }} />

        {/* ── Gradient overlay ── */}
        <div className="island-header__overlay" />

        {/* ── Content row ── */}
        <div className="island-header__content">
          <motion.div
            key={`icon-${activeIsland}`}
            className="island-header__icon-wrap"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1], delay: 0.08 }}
          >
            <Icon size={22} style={{ color }} />
          </motion.div>

          <div className="island-header__meta">
            <motion.div
              key={`eyebrow-${activeIsland}`}
              className="island-header__eyebrow"
              style={{ color }}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              {eyebrow}
            </motion.div>

            <motion.h2
              key={`title-${activeIsland}`}
              className="island-header__title"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            >
              {activeIsland}
            </motion.h2>

            <div className="island-header__stats">
              <span className="island-header__stat">
                <strong>{members}</strong> members
              </span>
              <span className="island-header__stat">
                <strong>{weekPosts}</strong> posts this week
              </span>
            </div>
          </div>

          <motion.span
            key={`pill-${activeIsland}`}
            className="island-header__pill"
            style={{ color, background: bg }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
          >
            {emoji} {activeIsland}
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
