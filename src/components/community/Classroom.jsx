import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, CheckCircle, Lock, Clock, Zap,
  Sparkles, BookOpen, Award, ChevronRight, X,
} from 'lucide-react';
import useStore, { getRank } from '../../store/useStore';
import { LESSONS, ISLAND_META } from '../../data/registry';

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP = { Zap, Sparkles, BookOpen };

// ─── Level badge ─────────────────────────────────────────────────────────────
const LEVEL_STYLES = {
  Beginner:     { color: '#52b788', bg: 'rgba(82,183,136,0.12)'   },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'   },
  Advanced:     { color: '#ef4444', bg: 'rgba(239,68,68,0.12)'    },
};

// ─── Lesson card variants ─────────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

// ─── XP Toast ─────────────────────────────────────────────────────────────────
function XPToast({ amount, rank, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.85 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
      onAnimationComplete={() => setTimeout(onDone, 1800)}
      style={{
        position: 'fixed', bottom: 32, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 500,
        background: 'rgba(14,24,18,0.96)',
        border: `1px solid ${rank.color}55`,
        borderRadius: 24,
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${rank.color}22`,
        backdropFilter: 'blur(16px)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 22 }}>🎉</span>
      <div>
        <div style={{
          fontFamily: 'var(--font-display,"Playfair Display",serif)',
          fontSize: '1rem', fontWeight: 800, color: '#e0eadd',
        }}>
          Lesson Complete!
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ color: rank.color, fontWeight: 700 }}>+{amount} XP</span>
          {' '}added to your profile
        </div>
      </div>
      <div style={{
        padding: '4px 12px', borderRadius: 20,
        background: rank.color + '18', color: rank.color,
        fontSize: '0.78rem', fontWeight: 700,
        border: `1px solid ${rank.color}33`,
      }}>
        {rank.icon} {rank.name}
      </div>
    </motion.div>
  );
}

// ─── Lesson Player Modal ───────────────────────────────────────────────────────
function LessonPlayer({ lesson, accent, onClose, onComplete, isCompleted }) {
  const [progress, setProgress] = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const intervalRef = useRef(null);

  const handlePlay = () => {
    if (isCompleted || playing) return;
    setPlaying(true);

    // Simulate lesson progress — 100 steps over 3 seconds for demo
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + 2;
        if (next >= 100) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          // Give React one frame before calling complete
          setTimeout(() => onComplete(lesson), 60);
          return 100;
        }
        return next;
      });
    }, 60);
  };

  const handleClose = () => {
    clearInterval(intervalRef.current);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(5,12,8,0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520,
          background: 'var(--sidebar-bg)',
          border: `1px solid ${accent.color}33`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accent.color}18`,
        }}
      >
        {/* Top accent strip */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accent.color}, ${accent.color}55, transparent)` }} />

        {/* Header */}
        <div style={{ padding: '20px 22px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, flexShrink: 0,
            background: accent.bg,
            border: `1px solid ${accent.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
          }}>
            {lesson.thumbnail}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: accent.color, marginBottom: 4,
            }}>
              {lesson.island} · {lesson.level}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display,"Playfair Display",serif)',
              fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}>
              {lesson.title}
            </h3>
            <div style={{ display: 'flex', gap: 12, marginTop: 5, alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                {lesson.duration}
              </span>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700,
                color: '#f59e0b', background: 'rgba(245,158,11,0.1)',
                padding: '1px 7px', borderRadius: 10,
              }}>
                +{lesson.xpReward} XP
              </span>
            </div>
          </div>
          <button onClick={handleClose} style={{
            background: 'rgba(255,255,255,0.06)', border: 'none',
            borderRadius: '50%', width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
          }}>
            <X size={13} />
          </button>
        </div>

        {/* Description */}
        <div style={{ padding: '0 22px 16px' }}>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            {lesson.description}
          </p>
          <div style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Instructor: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{lesson.instructor}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '0 22px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>{isCompleted ? 'Completed' : playing ? 'In progress…' : 'Ready to start'}</span>
            <span style={{ color: accent.color, fontWeight: 700 }}>{isCompleted ? 100 : progress}%</span>
          </div>
          <div style={{
            height: 6, background: 'rgba(255,255,255,0.07)',
            borderRadius: 8, overflow: 'hidden',
          }}>
            <motion.div
              animate={{ width: `${isCompleted ? 100 : progress}%` }}
              transition={{ duration: 0.1 }}
              style={{
                height: '100%', borderRadius: 8,
                background: `linear-gradient(90deg, ${accent.color}, var(--accent-2))`,
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 10,
        }}>
          {isCompleted ? (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '10px', borderRadius: 24,
              background: 'rgba(82,183,136,0.08)',
              border: '1px solid rgba(82,183,136,0.2)',
              color: '#52b788', fontSize: '0.88rem', fontWeight: 700,
            }}>
              <CheckCircle size={15} /> Lesson Complete
            </div>
          ) : (
            <button
              onClick={handlePlay}
              disabled={playing}
              style={{
                flex: 1, padding: '11px',
                borderRadius: 24, border: 'none',
                background: playing
                  ? 'rgba(255,255,255,0.05)'
                  : `linear-gradient(135deg, ${accent.color}, ${accent.color}bb)`,
                color: '#fff', fontSize: '0.9rem', fontWeight: 700,
                cursor: playing ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: playing ? 'none' : `0 4px 18px ${accent.color}33`,
                transition: 'all 0.2s',
              }}
            >
              {playing ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
                  Playing…
                </>
              ) : (
                <><Play size={15} fill="currentColor" /> Start Lesson</>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Classroom ────────────────────────────────────────────────────────────────
export default function Classroom() {
  const { activeIsland, addXP, userStats } = useStore();

  const [completedIds, setCompletedIds] = useState(new Set());
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [toast, setToast]   = useState(null); // { amount, rank }

  const accent      = ISLAND_META[activeIsland] ?? ISLAND_META.Sports;
  const Icon        = ICON_MAP[accent.icon] ?? BookOpen;

  // Filter lessons to the active island
  const islandLessons = LESSONS.filter(l => l.island === activeIsland);
  const activeLesson  = islandLessons.find(l => l.id === activeLessonId) ?? null;

  const totalXP     = islandLessons.reduce((s, l) => s + l.xpReward, 0);
  const earnedXP    = islandLessons
    .filter(l => completedIds.has(l.id))
    .reduce((s, l) => s + l.xpReward, 0);
  const courseProgress = islandLessons.length
    ? Math.round((completedIds.size / islandLessons.length) * 100)
    : 0;

  // Called by LessonPlayer when progress hits 100%
  const handleComplete = (lesson) => {
    if (completedIds.has(lesson.id)) return;

    // Mark complete
    setCompletedIds(prev => new Set([...prev, lesson.id]));

    // Fire XP into the store — this immediately updates ProfileDrawer, header widget, sidebar
    addXP(lesson.xpReward);

    // Show toast with updated rank
    const newXP   = userStats.xp + lesson.xpReward;
    const newRank = getRank(newXP);
    setToast({ amount: lesson.xpReward, rank: newRank });

    // Close the player
    setActiveLessonId(null);
  };

  return (
    <div style={{ maxWidth: 700, flex: 1 }}>

      {/* ── Course Header ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIsland}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'var(--card-bg)',
            border: `1px solid ${accent.color}33`,
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {/* Accent strip */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${accent.color}, ${accent.color}44, transparent)` }} />

          <div style={{ padding: '20px 24px' }}>
            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: accent.bg, border: `1px solid ${accent.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} style={{ color: accent.color }} />
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent.color, marginBottom: 2 }}>
                  {activeIsland} Classroom
                </div>
                <h2 style={{ fontFamily: 'var(--font-display,"Playfair Display",serif)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeIsland} Mastery Track
                </h2>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>Track XP</div>
                <div style={{ fontFamily: 'var(--font-display,"Playfair Display",serif)', fontSize: '1.1rem', fontWeight: 800, color: accent.color }}>
                  {earnedXP} / {totalXP}
                </div>
              </div>
            </div>

            {/* Course progress bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {completedIds.size} / {islandLessons.length} lessons completed
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: accent.color }}>
                {courseProgress}%
              </span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${courseProgress}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%', borderRadius: 8,
                  background: `linear-gradient(90deg, ${accent.color}, var(--accent-2))`,
                }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Lesson List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence mode="popLayout">
          {islandLessons.map((lesson, i) => {
            const isDone   = completedIds.has(lesson.id);
            const levelSty = LEVEL_STYLES[lesson.level] ?? LEVEL_STYLES.Beginner;

            return (
              <motion.div
                key={lesson.id}
                layout
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setActiveLessonId(lesson.id)}
                style={{
                  background: isDone
                    ? `${accent.color}09`
                    : 'var(--card-bg)',
                  border: `1px solid ${isDone ? accent.color + '30' : 'var(--border)'}`,
                  borderRadius: 14,
                  padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  if (!isDone) e.currentTarget.style.background = 'var(--hover-bg)';
                  e.currentTarget.style.borderColor = accent.color + '44';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isDone ? `${accent.color}09` : 'var(--card-bg)';
                  e.currentTarget.style.borderColor = isDone ? accent.color + '30' : 'var(--border)';
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: isDone ? `${accent.color}18` : accent.bg,
                  border: `1px solid ${accent.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, position: 'relative',
                }}>
                  {lesson.thumbnail}
                  {isDone && (
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 12,
                      background: `${accent.color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircle size={18} style={{ color: accent.color }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 700,
                      color: levelSty.color, background: levelSty.bg,
                      padding: '1px 7px', borderRadius: 10,
                    }}>
                      {lesson.level}
                    </span>
                    {isDone && (
                      <span style={{
                        fontSize: '0.62rem', fontWeight: 700,
                        color: '#52b788', background: 'rgba(82,183,136,0.1)',
                        padding: '1px 7px', borderRadius: 10,
                        border: '1px solid rgba(82,183,136,0.2)',
                      }}>
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '0.88rem', fontWeight: 600,
                    color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                    marginBottom: 4, lineHeight: 1.35,
                  }}>
                    {lesson.title}
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                      {lesson.duration}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700,
                      color: isDone ? 'var(--text-muted)' : '#f59e0b',
                    }}>
                      {isDone ? `+${lesson.xpReward} XP earned` : `+${lesson.xpReward} XP`}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      by {lesson.instructor}
                    </span>
                  </div>
                </div>

                {/* CTA / state icon */}
                <div style={{ flexShrink: 0 }}>
                  {isDone ? (
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: `${accent.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Award size={15} style={{ color: accent.color }} />
                    </div>
                  ) : (
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: accent.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s',
                    }}>
                      <ChevronRight size={15} style={{ color: accent.color }} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Course complete banner */}
      {islandLessons.length > 0 && courseProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 20, padding: '20px 24px',
            background: `linear-gradient(135deg, ${accent.color}10, rgba(245,158,11,0.06))`,
            border: `1px solid ${accent.color}33`,
            borderRadius: 16, textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎓</div>
          <div style={{ fontFamily: 'var(--font-display,"Playfair Display",serif)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            {activeIsland} Mastery Complete!
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            You've earned <strong style={{ color: accent.color }}>{earnedXP} XP</strong> from this track.
          </div>
        </motion.div>
      )}

      {/* ── Lesson Player Modal ── */}
      <AnimatePresence>
        {activeLesson && (
          <LessonPlayer
            key={activeLesson.id}
            lesson={activeLesson}
            accent={accent}
            isCompleted={completedIds.has(activeLesson.id)}
            onComplete={handleComplete}
            onClose={() => setActiveLessonId(null)}
          />
        )}
      </AnimatePresence>

      {/* ── XP Toast ── */}
      <AnimatePresence>
        {toast && (
          <XPToast
            key="xp-toast"
            amount={toast.amount}
            rank={toast.rank}
            onDone={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* spin keyframe for loading spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
