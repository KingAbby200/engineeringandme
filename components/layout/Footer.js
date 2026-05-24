'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguageStore, getTranslation } from '@/lib/store/languageStore';
import { Mail, Globe, Rss, GitBranch } from 'lucide-react';
import NewsletterForm from '@/components/ui/NewsletterForm';

const FOOTER_LINKS = {
  'Tutorials': [
    { label: 'Electrical Engineering', href: '/tutorials/electrical-electronics-engineering' },
    { label: 'Civil Engineering', href: '/tutorials/civil-engineering' },
    { label: 'Mechanical Engineering', href: '/tutorials/mechanical-engineering' },
    { label: 'Computer Engineering', href: '/tutorials/computer-engineering' },
    { label: 'Chemical Engineering', href: '/tutorials/chemical-engineering' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ],
  'Account': [
    { label: 'Sign Up', href: '/signup' },
    { label: 'Login', href: '/login' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
  ],
};

export default function Footer() {
  const language = useLanguageStore(state => state.language);
  const t = (key) => getTranslation(language, key);

  return (
    <footer style={{ background: 'var(--footer-bg, #0f172a)', color: 'var(--footer-text, #cbd5e1)', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--footer-logo-bg, #ffffff)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/images/logo.png" alt="Engineering Tutorials Logo" width={36} height={36} style={{ objectFit: 'contain' }} />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--footer-logo-text, white)', fontSize: '1rem' }}>Engineering<span style={{ color: '#22c55e' }}>&</span>Me</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--footer-desc-text, #94a3b8)', marginBottom: '1.25rem' }}>
              Free, structured engineering tutorials across all disciplines. Learn at your own pace with quizzes and progress tracking.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <Globe size={16} />, href: '#', label: 'Twitter/X' },
                { icon: <Rss size={16} />, href: '#', label: 'LinkedIn' },
                { icon: <GitBranch size={16} />, href: '#', label: 'GitHub' },
                { icon: <Mail size={16} />, href: '/contact', label: 'Email' },
              ].map(social => (
                <a key={social.label} href={social.href} title={social.label} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--footer-icon-bg, #1e293b)', borderRadius: 8, color: 'var(--footer-icon-text, #94a3b8)', textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--footer-icon-bg, #1e293b)'; e.currentTarget.style.color = 'var(--footer-icon-text, #94a3b8)'; }}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 style={{ color: 'var(--footer-heading, white)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{section}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} style={{ fontSize: '0.875rem', color: 'var(--footer-link-text, #94a3b8)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#22c55e'} onMouseLeave={e => e.currentTarget.style.color = 'var(--footer-link-text, #94a3b8)'}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'var(--footer-heading, white)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('newsletter')}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--footer-link-text, #94a3b8)', marginBottom: '1rem', lineHeight: 1.6 }}>{t('footerNewsletter')}</p>
            <NewsletterForm compact dark />
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--footer-border, #1e293b)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--footer-muted, #64748b)', margin: 0 }}>
            © {new Date().getFullYear()} Engineering Tutorials. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {[{ label: 'Privacy', href: '/privacy-policy' }, { label: 'Terms', href: '/terms' }, { label: 'Cookies', href: '/cookie-policy' }].map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: '0.8rem', color: 'var(--footer-muted, #64748b)', textDecoration: 'none' }}>{link.label}</Link>
            ))}
          </div>
        </div>

        {/* AdSense disclosure */}
        <p style={{ fontSize: '0.7rem', color: 'var(--footer-muted-dark, #475569)', marginTop: '0.75rem', textAlign: 'center' }}>
          This site uses Google AdSense to display ads. By using this site, you agree to our <Link href="/privacy-policy" style={{ color: '#22c55e', textDecoration: 'none' }}>Privacy Policy</Link> and <Link href="/cookie-policy" style={{ color: '#22c55e', textDecoration: 'none' }}>Cookie Policy</Link>.
        </p>
      </div>
    </footer>
  );
}
