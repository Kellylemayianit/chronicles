import { useState, useEffect } from 'react';
import useGamification from '../../hooks/useGamification';

const ISLAND_ACCENT = {
  Sports:    { color: '#ea580c', bg: 'rgba(234,88,12,0.12)', light: 'rgba(234,88,12,0.06)' },
  Beauty:    { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', light: 'rgba(168,85,247,0.06)' },
  Education: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', light: 'rgba(59,130,246,0.06)' },
};

// Mock extended gig data keyed by gig id
const GIG_DETAILS = {
  default: {
    description: `This comprehensive service delivers a full end-to-end solution crafted specifically for your needs. Every deliverable is produced with meticulous attention to detail and goes through multiple rounds of quality review before final submission.\n\nI bring years of hands-on experience in the East African market, which means your deliverable will resonate authentically with your target audience — not feel like it was copy-pasted from a global template.\n\nAll files are delivered in formats you can actually use, with a full walkthrough session included on completion.`,
    includes: ['Initial consultation call (30 min)', 'Up to 3 revision rounds', 'Source files included', 'Commercial use licence', 'Dedicated WhatsApp support'],
    packages: [
      { name: 'Basic', price: 3500, delivery: 3, desc: 'Core deliverable, 1 revision' },
      { name: 'Standard', price: 6500, delivery: 5, desc: 'Full package, 3 revisions', popular: true },
      { name: 'Premium', price: 12000, delivery: 7, desc: 'Everything + rush priority' },
    ],
    reviews: [
      { author: 'M. Kariuki', rating: 5, text: 'Exceptional quality. Delivered ahead of schedule and went above and beyond with extras.', time: '2 days ago' },
      { author: 'S. Otieno', rating: 5, text: 'Professional, fast, and communicative throughout. Will definitely rebook.', time: '1 week ago' },
      { author: 'P. Mwangi', rating: 4, text: 'Great work overall. Minor tweaks needed but handled quickly.', time: '2 weeks ago' },
    ],
  },
};

// ─── Payment Confirmation Modal ────────────────────────────────────────────────
function HireConfirmation({ gig, pkg, onConfirm, onCancel }) {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'processing' | 'success'

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 1800);
  };

  if (step === 'success') {
    return (
      <div style={confirmStyles.overlay} onClick={onCancel}>
        <div style={{ ...confirmStyles.box, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
            <div style={{ fontSize: 52, marginBottom: 12, animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-display,"Playfair Display",serif)', fontSize: '1.3rem', color: '#e8f0eb', marginBottom: 8 }}>Order Placed!</h3>
            <p style={{ color: '#a3b899', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Your order with <strong style={{ color: '#52b788' }}>{gig.sellerName}</strong> has been confirmed. You've earned <strong style={{ color: '#f59e0b' }}>+50 XP</strong> for supporting a local creator.
            </p>
            <div style={{ margin: '20px 0', padding: '14px', background: 'rgba(82,183,136,0.08)', borderRadius: 12, border: '1px solid rgba(82,183,136,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span style={{ color: '#5a7260' }}>Order ID</span>
                <span style={{ color: '#e8f0eb', fontWeight: 700, fontFamily: 'monospace' }}>#KC-{Math.floor(Math.random() * 90000) + 10000}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span style={{ color: '#5a7260' }}>Amount</span>
                <span style={{ color: '#52b788', fontWeight: 700 }}>KES {pkg.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#5a7260' }}>Delivery by</span>
                <span style={{ color: '#e8f0eb', fontWeight: 600 }}>{pkg.delivery} business days</span>
              </div>
            </div>
            <button onClick={onConfirm} style={{ ...confirmStyles.payBtn, width: '100%' }}>Go to My Orders →</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div style={confirmStyles.overlay}>
        <div style={{ ...confirmStyles.box, maxWidth: 300, textAlign: 'center', padding: '40px 30px' }}>
          <div style={{ fontSize: 36, marginBottom: 16, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
          <p style={{ color: '#a3b899', fontSize: '0.88rem' }}>Processing payment…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={confirmStyles.overlay} onClick={onCancel}>
      <div style={confirmStyles.box} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display,"Playfair Display",serif)', fontSize: '1.1rem', color: '#e8f0eb', marginBottom: 4 }}>Confirm Your Order</h3>
            <p style={{ color: '#5a7260', fontSize: '0.78rem' }}>Review details before proceeding</p>
          </div>
          <button onClick={onCancel} style={confirmStyles.closeBtn}>✕</button>
        </div>

        {/* Order summary */}
        <div style={confirmStyles.summaryCard}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24, background: 'rgba(82,183,136,0.1)', borderRadius: 8, padding: '6px 10px' }}>{gig.emoji ?? '🎨'}</div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e8f0eb', marginBottom: 3, lineHeight: 1.35 }}>{gig.title}</p>
              <p style={{ fontSize: '0.75rem', color: '#5a7260' }}>by {gig.sellerName} · <span style={{ color: '#52b788', fontWeight: 600 }}>{pkg.name} Package</span></p>
            </div>
          </div>
          <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
            {[
              ['Package', pkg.name],
              ['Delivery time', `${pkg.delivery} business days`],
              ['Revisions', pkg.name === 'Basic' ? '1' : '3'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.78rem', color: '#5a7260' }}>{k}</span>
                <span style={{ fontSize: '0.78rem', color: '#a3b899', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e8f0eb' }}>Total</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#52b788' }}>KES {pkg.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment method mock */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#5a7260', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Pay with</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['M-Pesa', 'Card', 'Kimana Wallet'].map((m, i) => (
              <button key={m} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10,
                background: i === 0 ? 'rgba(82,183,136,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === 0 ? 'rgba(82,183,136,0.3)' : 'rgba(255,255,255,0.07)'}`,
                color: i === 0 ? '#52b788' : '#a3b899',
                fontSize: '0.75rem', fontWeight: i === 0 ? 700 : 500, cursor: 'pointer',
              }}>
                {m === 'M-Pesa' ? '📱' : m === 'Card' ? '💳' : '🦋'} {m}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handlePay} style={{ ...confirmStyles.payBtn, width: '100%' }}>
          Pay KES {pkg.price.toLocaleString()} →
        </button>
        <p style={{ fontSize: '0.7rem', color: '#5a7260', textAlign: 'center', marginTop: 10 }}>
          🔒 Protected by Kimana Escrow — funds released on your approval
        </p>
      </div>
    </div>
  );
}

// ─── Main ServiceDetails Drawer ────────────────────────────────────────────────
export default function ServiceDetails({ gig, isOpen, onClose }) {
  const [selectedPkg, setSelectedPkg] = useState(1); // index into packages
  const [showHire, setShowHire] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews'

  const details = GIG_DETAILS[gig?.id] ?? GIG_DETAILS.default;
  const { rank } = useGamification(gig?.sellerXP ?? 1800);
  const accent = ISLAND_ACCENT[gig?.island] ?? ISLAND_ACCENT.Beauty;
  const pkg = details.packages[selectedPkg];

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !gig) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={drawerStyles.backdrop} onClick={onClose} />

      {/* Drawer */}
      <div style={drawerStyles.drawer}>

        {/* ── Top strip: island color accent ── */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${accent.color}, ${accent.color}44)` }} />

        {/* ── Header ── */}
        <div style={drawerStyles.header}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ ...drawerStyles.islandTag, color: accent.color, background: accent.bg }}>{gig.island}</span>
              <span style={{ ...drawerStyles.islandTag, color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>
                ⚡ {gig.deliveryDays}d delivery
              </span>
            </div>
            <h2 style={drawerStyles.title}>{gig.title}</h2>
          </div>
          <button onClick={onClose} style={drawerStyles.closeBtn}>✕</button>
        </div>

        {/* ── Seller row ── */}
        <div style={drawerStyles.sellerRow}>
          <div style={{ ...drawerStyles.sellerAvatar, background: `linear-gradient(135deg, ${accent.color}88, ${accent.color})` }}>
            {gig.sellerName?.[0] ?? 'A'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8f0eb' }}>{gig.sellerName}</span>
              <span style={{ fontSize: '0.68rem', color: '#52b788' }}>✅ Verified</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <span style={{ ...drawerStyles.rankBadge, color: rank.color, background: rank.color + '1a' }}>
                {rank.icon} {rank.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#5a7260' }}>
                ⭐ {gig.rating} ({gig.reviewCount} reviews)
              </span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#5a7260' }}>Response time</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#52b788' }}>~2 hours</div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={drawerStyles.tabs}>
          {['overview', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              ...drawerStyles.tab,
              color: activeTab === tab ? '#e8f0eb' : '#5a7260',
              borderBottom: `2px solid ${activeTab === tab ? '#52b788' : 'transparent'}`,
              fontWeight: activeTab === tab ? 700 : 500,
            }}>
              {tab === 'overview' ? '📋 Overview' : `⭐ Reviews (${details.reviews.length})`}
            </button>
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div style={drawerStyles.body}>
          {activeTab === 'overview' ? (
            <>
              {/* Description */}
              <p style={drawerStyles.description}>{details.description}</p>

              {/* What's included */}
              <div style={{ marginBottom: 22 }}>
                <h4 style={drawerStyles.sectionTitle}>What's included</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {details.includes.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.83rem', color: '#a3b899' }}>
                      <span style={{ color: '#52b788', fontSize: 12 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Package selector */}
              <h4 style={{ ...drawerStyles.sectionTitle, marginBottom: 10 }}>Choose a Package</h4>
              <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
                {details.packages.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPkg(i)}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: 12,
                      border: `1px solid ${selectedPkg === i ? accent.color + '55' : 'rgba(255,255,255,0.07)'}`,
                      background: selectedPkg === i ? accent.light : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                      position: 'relative',
                    }}
                  >
                    {p.popular && (
                      <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#0e1812', fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                        POPULAR
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedPkg === i ? accent.color : '#5a7260', marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: selectedPkg === i ? '#e8f0eb' : '#a3b899' }}>
                      KES {p.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.67rem', color: '#5a7260', marginTop: 3 }}>{p.delivery}d · {p.desc.split(',')[0]}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, padding: '14px 16px', background: 'rgba(245,158,11,0.06)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.1)' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{gig.rating}</span>
                <div>
                  <div style={{ color: '#f59e0b', fontSize: '1rem', letterSpacing: 2 }}>{'★'.repeat(Math.round(gig.rating))}</div>
                  <div style={{ fontSize: '0.72rem', color: '#5a7260' }}>{gig.reviewCount} verified reviews</div>
                </div>
              </div>
              {details.reviews.map((r, i) => (
                <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.025)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(82,183,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#52b788' }}>{r.author[0]}</div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e8f0eb' }}>{r.author}</span>
                    <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>{'★'.repeat(r.rating)}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#5a7260' }}>{r.time}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#a3b899', lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Sticky footer CTA ── */}
        <div style={drawerStyles.footer}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#5a7260' }}>{pkg.name} Package</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#52b788' }}>
              KES {pkg.price.toLocaleString()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <button style={drawerStyles.msgBtn}>💬 Message</button>
            <button onClick={() => setShowHire(true)} style={{ ...drawerStyles.hireBtn, background: `linear-gradient(135deg, ${accent.color}, ${accent.color}bb)` }}>
              Hire Now →
            </button>
          </div>
        </div>
      </div>

      {/* ── Hire confirmation modal ── */}
      {showHire && (
        <HireConfirmation
          gig={gig}
          pkg={pkg}
          onConfirm={() => { setShowHire(false); onClose(); }}
          onCancel={() => setShowHire(false)}
        />
      )}

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

const drawerStyles = {
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 900,
    background: 'rgba(5,12,8,0.65)',
    backdropFilter: 'blur(4px)',
  },
  drawer: {
    position: 'fixed', top: 0, right: 0, bottom: 0,
    width: '100%', maxWidth: 480,
    background: '#0e1812',
    borderLeft: '1px solid rgba(82,183,136,0.14)',
    zIndex: 901, display: 'flex', flexDirection: 'column',
    animation: 'slideInRight 0.28s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '-24px 0 60px rgba(0,0,0,0.4)',
  },
  header: {
    padding: '18px 20px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', gap: 12, alignItems: 'flex-start',
    flexShrink: 0,
  },
  title: {
    fontFamily: 'var(--font-display,"Playfair Display",serif)',
    fontSize: '1.1rem', fontWeight: 700, color: '#e8f0eb',
    lineHeight: 1.35,
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.07)', border: 'none',
    borderRadius: '50%', width: 30, height: 30,
    cursor: 'pointer', color: '#a3b899', fontSize: '0.8rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  islandTag: {
    fontSize: '0.65rem', fontWeight: 700, padding: '2px 9px',
    borderRadius: 20, letterSpacing: '0.07em',
  },
  sellerRow: {
    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
    borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
  },
  sellerAvatar: {
    width: 42, height: 42, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0,
  },
  rankBadge: {
    fontSize: '0.65rem', fontWeight: 700,
    padding: '2px 8px', borderRadius: 20,
  },
  tabs: {
    display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)',
    flexShrink: 0,
  },
  tab: {
    flex: 1, padding: '11px 16px', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.15s',
    fontFamily: 'var(--font-body,"DM Sans",sans-serif)',
  },
  body: {
    flex: 1, overflowY: 'auto', padding: '20px',
  },
  description: {
    fontSize: '0.85rem', color: '#a3b899', lineHeight: 1.75,
    marginBottom: 22, whiteSpace: 'pre-line',
  },
  sectionTitle: {
    fontSize: '0.72rem', fontWeight: 700, color: '#5a7260',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    marginBottom: 12,
  },
  footer: {
    padding: '14px 20px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(0,0,0,0.2)', flexShrink: 0,
  },
  msgBtn: {
    padding: '9px 16px', borderRadius: 22,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)', color: '#a3b899',
    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
  },
  hireBtn: {
    padding: '9px 22px', borderRadius: 22,
    border: 'none', color: '#fff',
    fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
};

const confirmStyles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1100,
    background: 'rgba(5,12,8,0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  box: {
    width: '100%', maxWidth: 440,
    background: '#111f17',
    border: '1px solid rgba(82,183,136,0.18)',
    borderRadius: 18, padding: '24px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
    animation: 'slideDown 0.2s cubic-bezier(0.16,1,0.3,1)',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.07)', border: 'none',
    borderRadius: '50%', width: 28, height: 28,
    cursor: 'pointer', color: '#a3b899', fontSize: '0.75rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  summaryCard: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, padding: '14px', marginBottom: 16,
  },
  payBtn: {
    padding: '12px 24px', borderRadius: 24,
    background: 'linear-gradient(135deg, #52b788, #3a7d44)',
    border: 'none', color: '#fff',
    fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(82,183,136,0.3)',
  },
};
