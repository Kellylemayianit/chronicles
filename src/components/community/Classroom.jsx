import { useState, useRef } from 'react';
import useStore from '../../store/useStore';
import useGamification from '../../hooks/useGamification';

// ─── Course data ───────────────────────────────────────────────────────────────
const COURSE = {
  id: 'course-kcse-math',
  title: 'KCSE Mathematics — Complete Syllabus Mastery',
  instructor: 'Wanjiku M.',
  instructorXP: 3200,
  instructorRole: 'Certified KCSE Tutor · 8 years experience',
  totalLessons: 12,
  totalDuration: '6h 40m',
  island: 'Education',
  sections: [
    {
      id: 's1',
      title: 'Algebra & Quadratics',
      lessons: [
        { id: 'l1', title: 'Introduction & Course Overview', duration: '8:24', free: true, completed: true },
        { id: 'l2', title: 'Solving Quadratic Equations', duration: '22:15', completed: true },
        { id: 'l3', title: 'Factorisation Techniques', duration: '18:40', completed: true },
        { id: 'l4', title: 'Practice & Past Paper Review', duration: '31:00', completed: false },
      ],
    },
    {
      id: 's2',
      title: 'Geometry & Trigonometry',
      lessons: [
        { id: 'l5', title: 'Sine, Cosine & Tangent Rules', duration: '25:50', completed: false },
        { id: 'l6', title: 'Circle Theorems (Full Guide)', duration: '34:10', completed: false },
        { id: 'l7', title: 'Area & Volume Calculations', duration: '28:00', completed: false },
      ],
    },
    {
      id: 's3',
      title: 'Statistics & Probability',
      lessons: [
        { id: 'l8', title: 'Mean, Median & Mode', duration: '20:30', completed: false },
        { id: 'l9', title: 'Probability Trees & Events', duration: '24:45', completed: false },
        { id: 'l10', title: 'Data Representation & Graphs', duration: '19:20', completed: false },
      ],
    },
    {
      id: 's4',
      title: 'Exam Strategy & Mock Tests',
      lessons: [
        { id: 'l11', title: 'Time Management in Exams', duration: '15:00', completed: false },
        { id: 'l12', title: 'Full Mock Paper Walkthrough', duration: '62:30', completed: false },
      ],
    },
  ],
};

// Flatten all lessons for navigation
const ALL_LESSONS = COURSE.sections.flatMap(s => s.lessons);

// ─── Lesson Item ───────────────────────────────────────────────────────────────
function LessonItem({ lesson, isActive, onSelect, sectionColor }) {
  return (
    <div
      onClick={() => onSelect(lesson)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px 9px 16px',
        borderRadius: 8, cursor: 'pointer',
        background: isActive ? 'rgba(82,183,136,0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(82,183,136,0.2)' : '1px solid transparent',
        transition: 'all 0.12s',
        marginBottom: 2,
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Status icon */}
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: lesson.completed ? 'rgba(82,183,136,0.2)' : isActive ? 'rgba(82,183,136,0.1)' : 'rgba(255,255,255,0.06)',
        border: `1.5px solid ${lesson.completed ? '#52b788' : isActive ? '#52b78855' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10,
      }}>
        {lesson.completed ? <span style={{ color: '#52b788' }}>✓</span> : isActive ? <span style={{ color: '#52b788', fontSize: 8 }}>▶</span> : null}
      </div>

      {/* Lesson info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.8rem', fontWeight: isActive ? 700 : 500,
          color: isActive ? '#e8f0eb' : lesson.completed ? '#a3b899' : '#7a9282',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.35,
        }}>
          {lesson.title}
        </div>
        <div style={{ fontSize: '0.65rem', color: '#5a7260', marginTop: 1 }}>
          {lesson.free && <span style={{ color: '#52b788', fontWeight: 700, marginRight: 5 }}>FREE</span>}
          {lesson.duration}
        </div>
      </div>

      {/* Lock icon for non-completed non-active future lessons */}
      {!lesson.completed && !isActive && !lesson.free && (
        <span style={{ fontSize: 11, color: '#3a4e40', flexShrink: 0 }}>🔒</span>
      )}
    </div>
  );
}

// ─── Video Player (mock) ───────────────────────────────────────────────────────
function VideoPlayer({ lesson, onComplete, onNext }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(lesson.completed ? 100 : 0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          onComplete(lesson.id);
          return 100;
        }
        return p + 0.5;
      });
    }, 80);
  };
  const handlePause = () => {
    setPlaying(false);
    clearInterval(intervalRef.current);
  };

  const formatTime = (pct) => {
    const [mins, secs] = lesson.duration.split(':').map(Number);
    const total = mins * 60 + secs;
    const current = Math.floor((pct / 100) * total);
    return `${Math.floor(current / 60)}:${String(current % 60).padStart(2, '0')}`;
  };

  return (
    <div style={playerStyles.container}>
      {/* Video area */}
      <div style={playerStyles.videoArea}>
        <div style={playerStyles.videoGrad} />

        {/* Overlay controls */}
        <div style={playerStyles.playOverlay}>
          <button
            onClick={playing ? handlePause : handlePlay}
            style={playerStyles.bigPlayBtn}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {playing ? '⏸' : progress === 100 ? '↺' : '▶'}
          </button>
        </div>

        {/* Lesson title overlay */}
        <div style={playerStyles.titleOverlay}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>NOW PLAYING</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{lesson.title}</div>
        </div>

        {/* Progress bar */}
        <div style={playerStyles.progressWrap}>
          <div style={{ ...playerStyles.progressFill, width: `${progress}%`, background: progress === 100 ? '#52b788' : 'linear-gradient(90deg, #52b788, #f59e0b)' }} />
        </div>
      </div>

      {/* Controls bar */}
      <div style={playerStyles.controlsBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={playing ? handlePause : handlePlay} style={playerStyles.ctrlBtn}>
            {playing ? '⏸️' : '▶️'}
          </button>
          <span style={{ fontSize: '0.8rem', color: '#a3b899', fontFamily: 'monospace' }}>
            {formatTime(progress)} / {lesson.duration}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {[0.75, 1, 1.25, 1.5].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{
              background: speed === s ? 'rgba(82,183,136,0.15)' : 'none',
              border: speed === s ? '1px solid rgba(82,183,136,0.3)' : '1px solid transparent',
              borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
              fontSize: '0.72rem', fontWeight: speed === s ? 700 : 500,
              color: speed === s ? '#52b788' : '#5a7260',
            }}>{s}x</button>
          ))}
          <button onClick={onNext} style={{ ...playerStyles.ctrlBtn, marginLeft: 4 }} title="Next lesson">⏭️</button>
          {progress === 100 && !lesson.completed && (
            <button onClick={() => onComplete(lesson.id)} style={playerStyles.markDoneBtn}>
              Mark Complete ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Classroom ────────────────────────────────────────────────────────────
export default function Classroom() {
  const { activeIsland } = useStore();
  const [activeLesson, setActiveLesson] = useState(ALL_LESSONS[3]); // first incomplete
  const [completedIds, setCompletedIds] = useState(
    new Set(ALL_LESSONS.filter(l => l.completed).map(l => l.id))
  );
  const [expandedSections, setExpandedSections] = useState(new Set(['s1', 's2']));

  const { rank, progress: xpProgress } = useGamification(completedIds.size * 80 + 240);
  const completedCount = completedIds.size;
  const totalLessons = ALL_LESSONS.length;
  const courseProgress = Math.round((completedCount / totalLessons) * 100);

  const markComplete = (lessonId) => {
    setCompletedIds(prev => new Set([...prev, lessonId]));
  };

  const goNext = () => {
    const idx = ALL_LESSONS.findIndex(l => l.id === activeLesson.id);
    if (idx < ALL_LESSONS.length - 1) setActiveLesson(ALL_LESSONS[idx + 1]);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  const { rank: instructorRank } = useGamification(COURSE.instructorXP);

  // Only render for Education island
  if (activeIsland !== 'Education') {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#5a7260' }}>
        <div style={{ fontSize: 42 }}>📚</div>
        <p style={{ fontSize: '0.9rem' }}>Switch to the <strong style={{ color: '#3b82f6' }}>Education</strong> island to access Classrooms.</p>
      </div>
    );
  }

  return (
    <div style={classroomStyles.root}>

      {/* ── Left: Video + Notes ── */}
      <div style={classroomStyles.main}>

        {/* Video player */}
        <VideoPlayer
          key={activeLesson.id}
          lesson={{ ...activeLesson, completed: completedIds.has(activeLesson.id) }}
          onComplete={markComplete}
          onNext={goNext}
        />

        {/* Lesson metadata */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display,"Playfair Display",serif)', fontSize: '1.25rem', fontWeight: 700, color: '#e8f0eb', marginBottom: 6, lineHeight: 1.3 }}>
                {activeLesson.title}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#5a7260' }}>
                from <span style={{ color: '#3b82f6', fontWeight: 600 }}>{COURSE.title}</span>
              </p>
            </div>
            {completedIds.has(activeLesson.id) && (
              <div style={{ background: 'rgba(82,183,136,0.12)', border: '1px solid rgba(82,183,136,0.2)', borderRadius: 20, padding: '5px 14px', color: '#52b788', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                ✓ Completed
              </div>
            )}
          </div>

          {/* Instructor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.025)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {COURSE.instructor[0]}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e8f0eb' }}>{COURSE.instructor}</span>
                <span style={{ fontSize: '0.65rem', color: '#52b788' }}>✅ Verified</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: instructorRank.color, background: instructorRank.color + '1a', padding: '1px 7px', borderRadius: 20 }}>
                  {instructorRank.icon} {instructorRank.name}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#5a7260', marginTop: 2 }}>{COURSE.instructorRole}</p>
            </div>
            <button style={{ marginLeft: 'auto', padding: '7px 16px', borderRadius: 20, border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
              Message
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: Progress Sidebar ── */}
      <aside style={classroomStyles.sidebar}>

        {/* Course progress header */}
        <div style={classroomStyles.progressHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e8f0eb' }}>Course Progress</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#52b788' }}>{courseProgress}%</span>
          </div>
          <div style={{ height: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', borderRadius: 10, width: `${courseProgress}%`, background: 'linear-gradient(90deg, #52b788, #3b82f6)', transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#5a7260' }}>
            <span>{completedCount} of {totalLessons} lessons done</span>
            <span>{COURSE.totalDuration}</span>
          </div>
        </div>

        {/* XP rank bar */}
        <div style={classroomStyles.rankCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>{rank.icon}</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: rank.color }}>{rank.name}</div>
              <div style={{ fontSize: '0.65rem', color: '#5a7260' }}>{completedIds.size * 80 + 240} XP earned</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#5a7260' }}>+80 XP/lesson</div>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 10, width: `${xpProgress}%`, background: `linear-gradient(90deg, ${rank.color}, #f59e0b)`, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0 8px' }} />

        {/* Lesson list */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {COURSE.sections.map((section, si) => {
            const isExpanded = expandedSections.has(section.id);
            const sectionCompleted = section.lessons.filter(l => completedIds.has(l.id)).length;
            const sectionTotal = section.lessons.length;
            const sectionDone = sectionCompleted === sectionTotal;

            return (
              <div key={section.id} style={{ marginBottom: 4 }}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: '100%', padding: '9px 12px',
                    background: 'rgba(255,255,255,0.025)',
                    border: 'none', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 8,
                    cursor: 'pointer', marginBottom: isExpanded ? 4 : 0,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                >
                  <span style={{ fontSize: 12, color: '#5a7260', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>›</span>
                  <span style={{ flex: 1, fontSize: '0.78rem', fontWeight: 700, color: '#a3b899', textAlign: 'left' }}>
                    {section.title}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: sectionDone ? '#52b788' : '#5a7260', fontWeight: 600 }}>
                    {sectionCompleted}/{sectionTotal}
                    {sectionDone && ' ✓'}
                  </span>
                </button>

                {/* Lessons */}
                {isExpanded && section.lessons.map(lesson => (
                  <LessonItem
                    key={lesson.id}
                    lesson={{ ...lesson, completed: completedIds.has(lesson.id) }}
                    isActive={activeLesson.id === lesson.id}
                    onSelect={setActiveLesson}
                    sectionColor='#3b82f6'
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Certificate teaser */}
        {courseProgress >= 80 && (
          <div style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, margin: '8px 0 0' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>🏅 Certificate Unlocking</div>
            <div style={{ fontSize: '0.72rem', color: '#5a7260' }}>
              Complete {totalLessons - completedCount} more lesson{totalLessons - completedCount !== 1 ? 's' : ''} to earn your Kimana Certificate.
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

const classroomStyles = {
  root: {
    display: 'flex', height: '100%', overflow: 'hidden',
    background: '#0e1812',
  },
  main: {
    flex: 1, overflowY: 'auto',
    display: 'flex', flexDirection: 'column',
    minWidth: 0,
  },
  sidebar: {
    width: 300, flexShrink: 0,
    background: '#0a1410',
    borderLeft: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column',
    padding: '14px 12px 0',
    overflow: 'hidden',
  },
  progressHeader: {
    padding: '10px 4px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 10, flexShrink: 0,
  },
  rankCard: {
    background: 'rgba(82,183,136,0.06)', border: '1px solid rgba(82,183,136,0.1)',
    borderRadius: 10, padding: '10px 12px', marginBottom: 10, flexShrink: 0,
  },
};

const playerStyles = {
  container: {
    background: '#000', flexShrink: 0,
  },
  videoArea: {
    position: 'relative',
    paddingTop: '52%',
    background: '#050e07',
    overflow: 'hidden',
  },
  videoGrad: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(82,183,136,0.08) 0%, transparent 60%)',
  },
  playOverlay: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  bigPlayBtn: {
    width: 64, height: 64, borderRadius: '50%',
    background: 'rgba(82,183,136,0.2)',
    border: '2px solid rgba(82,183,136,0.5)',
    color: '#52b788', fontSize: 24,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', backdropFilter: 'blur(8px)',
    transition: 'transform 0.15s, background 0.15s',
  },
  titleOverlay: {
    position: 'absolute', bottom: 32, left: 20, right: 20,
  },
  progressWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 4, background: 'rgba(255,255,255,0.1)',
  },
  progressFill: {
    height: '100%', transition: 'width 0.1s linear',
  },
  controlsBar: {
    padding: '10px 16px', background: '#080f0a',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  ctrlBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 18, padding: '2px 4px',
    display: 'flex', alignItems: 'center',
  },
  markDoneBtn: {
    padding: '5px 14px', borderRadius: 20,
    background: 'rgba(82,183,136,0.12)', border: '1px solid rgba(82,183,136,0.3)',
    color: '#52b788', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
  },
};
