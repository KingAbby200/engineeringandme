'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Menu, X, Search, ChevronDown, BookOpen, User, LogOut, Settings, LayoutDashboard, Flame } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchUser, logout } = useAuthStore();
  const dropdownRef = useRef(null);

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'U')}&backgroundColor=16a34a`;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: scrolled ? 'rgba(255,255,255,0.97)' : 'white', borderBottom: '1px solid #e5e7eb', backdropFilter: 'blur(8px)', transition: 'box-shadow 0.2s', boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', height: '64px', gap: '1rem' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0, marginRight: 'auto' }}>
          <Image src="/images/logo.png" alt="Engineering Tutorials Logo" width={36} height={36} style={{ objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', fontFamily: 'IBM Plex Sans, sans-serif' }} className="logo-text">
            Engineering<span style={{ color: '#16a34a' }}>&</span>Me
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '1rem', flex: 1 }} className="hidden-mobile">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} style={{ padding: '0.4rem 0.75rem', borderRadius: 6, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', color: pathname === link.href ? '#16a34a' : '#374151', background: pathname === link.href ? '#f0fdf4' : 'transparent', transition: 'all 0.15s' }}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ flex: 1 }} className="spacer-desktop" />

        {/* Search */}
        <div style={{ position: 'relative' }} className="search-container">
          {searchOpen ? (
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tutorials..."
                style={{ padding: '0.4rem 0.75rem', border: '1.5px solid #16a34a', borderRadius: 6, fontSize: '0.875rem', outline: 'none', width: '220px', fontFamily: 'IBM Plex Sans, sans-serif' }}
              />
              <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '0.25rem' }}><X size={18} /></button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '0.4rem', borderRadius: 6, display: 'flex', alignItems: 'center' }} title="Search" className="search-button">
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Auth */}
        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative' }} className="auth-container">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '0.3rem 0.6rem', cursor: 'pointer', transition: 'border-color 0.15s' }}>
              <Image src={avatarUrl} alt={user.name} width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="user-name">
                {user.name?.split(' ')[0]}
              </span>
              {user.streak?.current > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }} className="streak-badge">
                  <Flame size={14} /> {user.streak.current}
                </span>
              )}
              <ChevronDown size={14} color="#9ca3af" />
            </button>

            {dropdownOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 200, zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0 }}>{user.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '2px 0 0', textTransform: 'capitalize' }}>{user.role}</p>
                </div>
                {[
                  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
                  { href: '/profile', label: 'Profile', icon: <User size={15} /> },
                  ...(user.role === 'admin' ? [{ href: '/admin/dashboard', label: 'Admin Panel', icon: <Settings size={15} /> }] : []),
                  ...(user.role === 'author' ? [{ href: '/admin/tutorials', label: 'My Tutorials', icon: <BookOpen size={15} /> }] : []),
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: '#374151', textDecoration: 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#9ca3af' }}>{item.icon}</span>{item.label}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid #f3f4f6' }}>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className="auth-buttons">
            <Link href="/login" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: 6, border: '1.5px solid #e5e7eb', transition: 'border-color 0.15s' }}>Login</Link>
            <Link href="/signup" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'white', background: '#16a34a', borderRadius: 6, textDecoration: 'none', transition: 'background 0.15s' }}>Sign Up</Link>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: '0.3rem' }} className="show-mobile">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '1rem 1.25rem', maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.6rem 0', fontSize: '0.95rem', fontWeight: 500, color: pathname === link.href ? '#16a34a' : '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
              {link.label}
            </Link>
          ))}
          <form onSubmit={handleSearch} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tutorials..." style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1.5px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem', outline: 'none', fontFamily: 'IBM Plex Sans, sans-serif' }} />
            <button type="submit" style={{ padding: '0.5rem 0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}><Search size={16} /></button>
          </form>
          {user && (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>Account</p>
              {[
                { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
                { href: '/profile', label: 'Profile', icon: <User size={15} /> },
                ...(user.role === 'admin' ? [{ href: '/admin/dashboard', label: 'Admin Panel', icon: <Settings size={15} /> }] : []),
                ...(user.role === 'author' ? [{ href: '/admin/tutorials', label: 'My Tutorials', icon: <BookOpen size={15} /> }] : []),
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0', fontSize: '0.875rem', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#9ca3af' }}>{item.icon}</span>{item.label}
                </Link>
              ))}
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0', fontSize: '0.875rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
          {!user && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, padding: '0.6rem', textAlign: 'center', border: '1.5px solid #e5e7eb', borderRadius: 6, color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Login</Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} style={{ flex: 1, padding: '0.6rem', textAlign: 'center', background: '#16a34a', color: 'white', borderRadius: 6, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .spacer-desktop { display: none !important; }
          .search-container { display: none !important; }
          .search-button { display: none !important; }
          .auth-container { display: none !important; }
          .auth-buttons { display: none !important; }
          .user-name { display: none !important; }
          .streak-badge { display: none !important; }
          .logo-text { font-size: 0.9rem; }
        }
      `}</style>
    </header>
  );
}
