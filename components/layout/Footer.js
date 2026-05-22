'use client';
import Link from 'next/link';
import { BookOpen, Mail, Globe, Rss, GitBranch } from 'lucide-react';
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
  return (
    <footer style={{ background: '#0f172a', color: '#cbd5e1', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.25rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: '#16a34a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color="white" />
              </div>
              <span style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Engineering<span style={{ color: '#22c55e' }}>Tutorials</span></span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '1.25rem' }}>
              Free, structured engineering tutorials across all disciplines. Learn at your own pace with quizzes and progress tracking.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <Globe size={16} />, href: '#', label: 'Twitter/X' },
                { icon: <Rss size={16} />, href: '#', label: 'LinkedIn' },
                { icon: <GitBranch size={16} />, href: '#', label: 'GitHub' },
                { icon: <Mail size={16} />, href: '/contact', label: 'Email' },
              ].map(social => (
                <a key={social.label} href={social.href} title={social.label} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{section}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} style={{ fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#22c55e'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Newsletter</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.6 }}>Get the latest tutorials delivered to your inbox.</p>
            <NewsletterForm compact dark />
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            © {new Date().getFullYear()} Engineering Tutorials. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {[{ label: 'Privacy', href: '/privacy-policy' }, { label: 'Terms', href: '/terms' }, { label: 'Cookies', href: '/cookie-policy' }].map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'none' }}>{link.label}</Link>
            ))}
          </div>
        </div>

        {/* AdSense disclosure */}
        <p style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.75rem', textAlign: 'center' }}>
          This site uses Google AdSense to display ads. By using this site, you agree to our <Link href="/privacy-policy" style={{ color: '#22c55e', textDecoration: 'none' }}>Privacy Policy</Link> and <Link href="/cookie-policy" style={{ color: '#22c55e', textDecoration: 'none' }}>Cookie Policy</Link>.
        </p>
      </div>
    </footer>
  );
}
