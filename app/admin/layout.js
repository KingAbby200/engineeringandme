'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { LayoutDashboard, BookOpen, Users, Clock, FolderOpen, Settings, ChevronRight, LogOut, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
  { href: '/admin/pending', label: 'Pending Review', icon: <Clock size={17} /> },
  { href: '/admin/tutorials', label: 'All Tutorials', icon: <BookOpen size={17} /> },
  { href: '/admin/categories', label: 'Categories', icon: <FolderOpen size={17} /> },
  { href: '/admin/authors', label: 'Authors', icon: <Users size={17} /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings size={17} /> },
];

export default function AdminLayout({ children }) {
  const { user, fetchUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetchUser().then(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!checking && user && !['admin', 'author'].includes(user.role)) router.push('/dashboard');
    if (!checking && !user) router.push('/login');
  }, [checking, user]);

  useEffect(() => {
    if (!checking && user && user.role === 'author' && pathname.startsWith('/admin/') && !pathname.startsWith('/admin/tutorials')) {
      router.push('/admin/tutorials');
    }
  }, [checking, user, pathname]);

  if (checking || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
          Checking access…
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (user.role !== 'admin' && user.role !== 'author') return null;

  const navItems = user.role === 'admin'
    ? NAV
    : [{ href: '/admin/tutorials', label: 'My Tutorials', icon: <BookOpen size={17} /> }];

  const Sidebar = () => (
    <div style={{ width: 240, background: '#0f172a', color: '#cbd5e1', height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutDashboard size={18} color="white" />
          <p style={{ margin: 0, fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Admin Panel</p>
        </div>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>{user.email}</p>
      </div>
      <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
        {NAV.map(item => (
          <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 1rem', margin: '0.1rem 0.5rem', borderRadius: 7, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.1s', background: pathname === item.href ? '#16a34a' : 'transparent', color: pathname === item.href ? 'white' : '#94a3b8' }}
            onMouseEnter={e => { if (pathname !== item.href) e.currentTarget.style.background = '#1e293b'; }}
            onMouseLeave={e => { if (pathname !== item.href) e.currentTarget.style.background = 'transparent'; }}>
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
        <Link href="/" style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textDecoration: 'none', marginBottom: '0.5rem' }}>← Back to site</Link>
        <button onClick={() => { logout(); router.push('/'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', padding: '0.3rem 0', fontFamily: 'inherit' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'flex', height: '100%' }} className="admin-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50 }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <button onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', top: 12, right: -40, background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
              <Sidebar />
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', background: '#f8fafc' }}>
        {/* Mobile topbar */}
        <div style={{ padding: '0.75rem 1rem', background: '#0f172a', display: 'none', alignItems: 'center', gap: '0.75rem' }} className="admin-mobile-topbar">
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><Menu size={22} /></button>
          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Admin Panel</span>
        </div>
        {children}
      </div>

      <style>{`
        @media(max-width:768px){
          .admin-sidebar-desktop{display:none!important}
          .admin-mobile-topbar{display:flex!important}
        }
      `}</style>
    </div>
  );
}
