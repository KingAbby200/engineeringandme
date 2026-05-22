'use client';
import { useEffect } from 'react';

export default function AdUnit({ slot, format = 'auto', responsive = true, style = {} }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {}
  }, []);

  if (!clientId || clientId === 'ca-pub-your-adsense-id') {
    // Placeholder in development
    return (
      <div style={{ background: '#f0fdf4', border: '1.5px dashed #bbf7d0', borderRadius: 8, padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', ...style }}>
        <p style={{ margin: 0 }}>Ad Space</p>
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
}
