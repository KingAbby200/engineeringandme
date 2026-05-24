'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguageStore, getTranslation } from '@/lib/store/languageStore';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const language = useLanguageStore(state => state.language);
  const t = (key) => getTranslation(language, key);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setTimeout(() => setVisible(true), 1500);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0f172a', borderTop: '2px solid #16a34a', zIndex: 9999, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', boxShadow: '0 -4px 24px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e' }}>
        <Cookie size={20} />
      </div>
      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, flex: 1, margin: 0 }}>
        {t('cookieBannerCopy')} <Link href="/cookie-policy" style={{ color: '#22c55e', textDecoration: 'underline' }}>{t('learnMore')}</Link>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={decline} style={{ padding: '0.4rem 0.85rem', border: '1px solid #334155', borderRadius: 6, background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}>
          {t('decline')}
        </button>
        <button onClick={accept} style={{ padding: '0.4rem 1rem', borderRadius: 6, background: '#16a34a', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
          {t('acceptAll')}
        </button>
        <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem' }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
