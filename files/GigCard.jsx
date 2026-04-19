import useGamification from '../../hooks/useGamification';

/**
 * GigCard
 * @param {{ title: string, price: number, sellerName: string, sellerXP: number,
 *           island: string, rating: number, reviewCount: number,
 *           imageBg: string, deliveryDays: number }} props
 */
export default function GigCard({
  title = 'Professional Logo Design for Your Brand',
  price = 49,
  sellerName = 'Aisha N.',
  sellerXP = 1800,
  island = 'Beauty',
  rating = 4.9,
  reviewCount = 127,
  imageBg = 'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)',
  deliveryDays = 3,
}) {
  const { rank } = useGamification(sellerXP);

  const ISLAND_COLORS = {
    Sports: { bg: 'rgba(234,88,12,0.12)', text: '#ea580c' },
    Beauty: { bg: 'rgba(168,85,247,0.12)', text: '#a855f7' },
    Education: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  };
  const islandStyle = ISLAND_COLORS[island] ?? { bg: 'rgba(99,102,241,0.12)', text: '#6366f1' };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 150,
        background: imageBg,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 42, opacity: 0.6 }}>🎨</span>
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: islandStyle.bg, color: islandStyle.text,
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
          padding: '3px 8px', borderRadius: 20, backdropFilter: 'blur(6px)',
        }}>
          {island.toUpperCase()}
        </div>
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(0,0,0,0.4)', color: '#fff',
          fontSize: '0.7rem', fontWeight: 600,
          padding: '3px 8px', borderRadius: 20, backdropFilter: 'blur(6px)',
        }}>
          ⚡ {deliveryDays}d
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        {/* Seller row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {sellerName[0]}
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{sellerName}</span>
            <span style={{
              marginLeft: 6, fontSize: '0.68rem', fontWeight: 700,
              color: rank.color, background: rank.color + '18',
              padding: '1px 6px', borderRadius: 10,
            }}>
              {rank.icon} {rank.name}
            </span>
          </div>
        </div>

        {/* Title */}
        <p style={{
          fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)',
          lineHeight: 1.4, marginBottom: 10,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {title}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>★</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{rating}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({reviewCount})</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Starting at</span>
        <span style={{
          fontSize: '1.05rem', fontWeight: 800,
          color: 'var(--accent)',
          fontFamily: 'var(--font-display)',
        }}>
          KES {(price * 130).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
