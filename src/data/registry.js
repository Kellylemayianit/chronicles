// ─────────────────────────────────────────────────────────────────────────────
// registry.js  ·  Chronicles Single Source of Truth
// All hardcoded data arrays live here. Import from this file everywhere.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Island palette helpers (keep in sync with index.css tokens) ─────────────
export const ISLAND_META = {
  Sports: {
    color:   '#ea580c',
    bg:      'rgba(234,88,12,0.12)',
    light:   'rgba(234,88,12,0.06)',
    cssColor:'var(--island-sports-color)',
    cssBg:   'var(--island-sports-bg)',
  },
  Beauty: {
    color:   '#a855f7',
    bg:      'rgba(168,85,247,0.12)',
    light:   'rgba(168,85,247,0.06)',
    cssColor:'var(--island-beauty-color)',
    cssBg:   'var(--island-beauty-bg)',
  },
  Education: {
    color:   '#3b82f6',
    bg:      'rgba(59,130,246,0.12)',
    light:   'rgba(59,130,246,0.06)',
    cssColor:'var(--island-education-color)',
    cssBg:   'var(--island-education-bg)',
  },
};

// ─── Gig Registry ─────────────────────────────────────────────────────────────
// Used by: App.jsx (Marketplace Grid), GlobalSearch.jsx (Trending Gigs)
export const GIGS = [
  {
    id:           'gig-001',
    title:        'Professional Logo Design for Your Brand',
    price:        49,
    sellerName:   'Aisha N.',
    sellerXP:     1800,
    island:       'Beauty',
    rating:       4.9,
    reviewCount:  127,
    imageBg:      'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)',
    deliveryDays: 3,
    emoji:        '🎨',
    trending:     true,
  },
  {
    id:           'gig-002',
    title:        'Local Logistics Hero',
    price:        15,
    sellerName:   'Brian O.',
    sellerXP:     650,
    island:       'Sports',
    rating:       5.0,
    reviewCount:  12,
    imageBg:      'linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%)',
    deliveryDays: 2,
    emoji:        '🚚',
    trending:     false,
  },
  {
    id:           'gig-003',
    title:        'Island Beauty Pack',
    price:        85,
    sellerName:   'Wanjiku G.',
    sellerXP:     2200,
    island:       'Beauty',
    rating:       4.8,
    reviewCount:  44,
    imageBg:      'linear-gradient(135deg, #2a1a3a 0%, #6a2d6a 100%)',
    deliveryDays: 4,
    emoji:        '✨',
    trending:     true,
  },
  {
    id:           'gig-004',
    title:        'Sports Coaching Session',
    price:        35,
    sellerName:   'Otieno K.',
    sellerXP:     3100,
    island:       'Sports',
    rating:       4.7,
    reviewCount:  89,
    imageBg:      'linear-gradient(135deg, #1a2a3a 0%, #2d4f6a 100%)',
    deliveryDays: 1,
    emoji:        '⚽',
    trending:     true,
  },
  {
    id:           'gig-005',
    title:        'Curriculum Design & Tutoring',
    price:        60,
    sellerName:   'Njeri W.',
    sellerXP:     980,
    island:       'Education',
    rating:       5.0,
    reviewCount:  23,
    imageBg:      'linear-gradient(135deg, #1a2a1a 0%, #3a6a2d 100%)',
    deliveryDays: 5,
    emoji:        '📚',
    trending:     true,
  },
  {
    id:           'gig-006',
    title:        'Brand Identity Full Package',
    price:        120,
    sellerName:   'Amina S.',
    sellerXP:     4500,
    island:       'Beauty',
    rating:       4.9,
    reviewCount:  61,
    imageBg:      'linear-gradient(135deg, #3a2a1a 0%, #6a4f2d 100%)',
    deliveryDays: 7,
    emoji:        '🏷️',
    trending:     true,
  },
];

// ─── Derived: Trending Gigs for GlobalSearch ──────────────────────────────────
// Enriches the GIGS registry with display-ready search fields.
export const TRENDING_GIGS = GIGS
  .filter(g => g.trending)
  .map(g => ({
    id:          g.id,
    emoji:       g.emoji,
    title:       g.title,
    island:      g.island,
    price:       `KES ${(g.price * 130).toLocaleString()}`,
    rating:      String(g.rating),
    islandColor: ISLAND_META[g.island]?.cssColor ?? 'var(--accent)',
    islandBg:    ISLAND_META[g.island]?.cssBg    ?? 'var(--active-bg)',
  }));

// ─── Community Posts ──────────────────────────────────────────────────────────
// Used by: Feed.jsx
export const POSTS = [
  {
    id:         1,
    author:     'Wanjiku M.',
    authorXP:   3200,
    island:     'Education',
    time:       '2m ago',
    content:    'Just completed the Canopy-level challenge on Digital Marketing! The community resources here are genuinely transformative. Who else is on this track? 🌲',
    likes:      42,
    comments:   11,
    reposts:    7,
    avatar:     'W',
    avatarGrad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  },
  {
    id:         2,
    author:     'Omondi K.',
    authorXP:   720,
    island:     'Sports',
    time:       '18m ago',
    content:    'Offering personal training sessions — 6AM slots available in Westlands. DM or find my gig on the Marketplace. First session free for Grove members and above! ⚡',
    likes:      89,
    comments:   23,
    reposts:    14,
    avatar:     'O',
    avatarGrad: 'linear-gradient(135deg, #ea580c, #facc15)',
  },
  {
    id:         3,
    author:     'Amina S.',
    authorXP:   5500,
    island:     'Beauty',
    time:       '1h ago',
    content:    'Thread: How I scaled my braiding studio from 2 clients/week to 30 using Chronicles. 🧵👇\n\n1/ The biggest unlock was the Community Feed. I stopped thinking about "posts" and started sharing genuine behind-the-scenes value.',
    likes:      214,
    comments:   67,
    reposts:    55,
    avatar:     'A',
    avatarGrad: 'linear-gradient(135deg, #a855f7, #ec4899)',
    isThread:   true,
  },
];

// ─── Top Islanders ────────────────────────────────────────────────────────────
// Used by: GlobalSearch.jsx
export const TOP_ISLANDERS = [
  { id: 'u1', initials: 'A', name: 'Amina S.',   handle: '@aminas',   xpLabel: '5,500 XP', rank: '🌳 Canopy',   island: 'Beauty',    grad: 'linear-gradient(135deg,#a855f7,#ec4899)', islandColor: 'var(--island-beauty-color)'    },
  { id: 'u2', initials: 'O', name: 'Otieno K.',  handle: '@otienok',  xpLabel: '3,100 XP', rank: '🌿 Sprout',   island: 'Sports',    grad: 'linear-gradient(135deg,#ea580c,#facc15)', islandColor: 'var(--island-sports-color)'    },
  { id: 'u3', initials: 'W', name: 'Wanjiku M.', handle: '@wanjikum', xpLabel: '3,200 XP', rank: '🌿 Sprout',   island: 'Education', grad: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', islandColor: 'var(--island-education-color)' },
  { id: 'u4', initials: 'N', name: 'Njeri W.',   handle: '@njeriw',   xpLabel: '980 XP',   rank: '🌱 Seedling', island: 'Education', grad: 'linear-gradient(135deg,#22c55e,#3b82f6)', islandColor: 'var(--island-education-color)' },
  { id: 'u5', initials: 'B', name: 'Brian O.',   handle: '@briano',   xpLabel: '650 XP',   rank: '🌱 Seedling', island: 'Sports',    grad: 'linear-gradient(135deg,#f97316,#ea580c)', islandColor: 'var(--island-sports-color)'    },
];

// ─── GIG_DETAILS — extended data for ServiceDetails.jsx ──────────────────────
export const GIG_DETAILS = {
  default: {
    description: `This comprehensive service delivers a full end-to-end solution crafted specifically for your needs. Every deliverable is produced with meticulous attention to detail and goes through multiple rounds of quality review before final submission.\n\nI bring years of hands-on experience in the East African market, which means your deliverable will resonate authentically with your target audience — not feel like it was copy-pasted from a global template.\n\nAll files are delivered in formats you can actually use, with a full walkthrough session included on completion.`,
    includes: [
      'Initial consultation call (30 min)',
      'Up to 3 revision rounds',
      'Source files included',
      'Commercial use licence',
      'Dedicated WhatsApp support',
    ],
    packages: [
      { name: 'Basic',    price: 3500,  delivery: 3, desc: 'Core deliverable, 1 revision' },
      { name: 'Standard', price: 6500,  delivery: 5, desc: 'Full package, 3 revisions', popular: true },
      { name: 'Premium',  price: 12000, delivery: 7, desc: 'Everything + rush priority' },
    ],
    reviews: [
      { author: 'M. Kariuki', rating: 5, text: 'Exceptional quality. Delivered ahead of schedule and went above and beyond with extras.', time: '2 days ago' },
      { author: 'S. Otieno',  rating: 5, text: 'Professional, fast, and communicative throughout. Will definitely rebook.', time: '1 week ago' },
      { author: 'P. Mwangi',  rating: 4, text: 'Great work overall. Minor tweaks needed but handled quickly.', time: '2 weeks ago' },
    ],
  },
};
