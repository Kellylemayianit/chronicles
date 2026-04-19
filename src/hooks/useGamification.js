const RANKS = [
  { name: 'Seed',         minXP: 0,     icon: '🌱', color: '#a3b899' },
  { name: 'Sprout',       minXP: 100,   icon: '🌿', color: '#6dab68' },
  { name: 'Sapling',      minXP: 300,   icon: '🪴', color: '#4e9e4e' },
  { name: 'Grove',        minXP: 700,   icon: '🌳', color: '#3a7d44' },
  { name: 'Canopy',       minXP: 1500,  icon: '🌲', color: '#2d6a4f' },
  { name: 'Elder Tree',   minXP: 3000,  icon: '🏔️', color: '#1b4332' },
  { name: 'Ancient Forest', minXP: 6000, icon: '🌏', color: '#081c15' },
];

/**
 * useGamification
 * @param {number} xp - Current XP of the user
 * @returns {{ rank: object, nextRank: object|null, progress: number, xp: number }}
 */
const useGamification = (xp = 0) => {
  let currentRankIndex = 0;

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) {
      currentRankIndex = i;
      break;
    }
  }

  const rank = RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1] ?? null;

  let progress = 100;
  if (nextRank) {
    const earned = xp - rank.minXP;
    const needed = nextRank.minXP - rank.minXP;
    progress = Math.min(100, Math.floor((earned / needed) * 100));
  }

  return { rank, nextRank, progress, xp, allRanks: RANKS };
};

export default useGamification;
