import Link from 'next/link';

export const metadata = { title: 'Unsubscribed' };

export default function UnsubscribedPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ width: 72, height: 72, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
          ✉️
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem' }}>You've been unsubscribed</h1>
        <p style={{ color: '#6b7280', lineHeight: 1.7, margin: '0 0 2rem' }}>
          You've been successfully removed from our newsletter. You won't receive any more emails from us.
          If this was a mistake, you can re-subscribe on our homepage.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '0.65rem 1.5rem', background: '#16a34a', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Back to Home
          </Link>
          <Link href="/contact" style={{ padding: '0.65rem 1.5rem', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
