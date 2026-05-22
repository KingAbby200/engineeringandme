'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, Menu, X, Clock } from 'lucide-react';

export default function TutorialSidebar({ tutorial, pages, currentPageId, userProgress, categorySlug }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const completedIds = userProgress?.pagesCompleted?.map(p => p.toString()) || [];

  const DrawerContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid #e5e7eb', background: '#f0fdf4' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16a34a', fontWeight: 600 }}>Tutorial</span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'none' }} className="close-btn">
            <X size={18} />
          </button>
        </div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.4 }}>{tutorial?.title}</h3>
        {userProgress && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.3rem' }}>
              <span>Progress</span>
              <span style={{ fontWeight: 600, color: '#16a34a' }}>{userProgress.percentComplete || 0}%</span>
            </div>
            <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${userProgress.percentComplete || 0}%`, height: '100%', background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: 3, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )}
      </div>

      {/* Pages list */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>
        {pages?.map((page, index) => {
          const isActive = page._id.toString() === currentPageId;
          const isCompleted = completedIds.includes(page._id.toString());
          const href = `/tutorials/${categorySlug}/${tutorial?.slug}/${page.slug}`;

          return (
            <Link
              key={page._id}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.6rem 1.25rem',
                background: isActive ? '#f0fdf4' : 'transparent',
                borderLeft: `3px solid ${isActive ? '#16a34a' : 'transparent'}`,
                textDecoration: 'none', transition: 'background 0.1s',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {isCompleted ? (
                  <CheckCircle size={15} color="#16a34a" />
                ) : (
                  <div style={{ width: 15, height: 15, borderRadius: '50%', border: `2px solid ${isActive ? '#16a34a' : '#d1d5db'}`, background: isActive ? '#16a34a' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isActive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'white' }} />}
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.825rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#16a34a' : '#374151', margin: 0, lineHeight: 1.4 }}>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem', marginRight: '0.25rem' }}>{index + 1}.</span>
                  {page.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                  <Clock size={10} color="#9ca3af" />
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{page.readingTime || 5} min</span>
                  {page.quiz?.enabled && <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '0 0.3rem', borderRadius: 3, fontWeight: 500 }}>Quiz</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Back to tutorials */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
        <Link href={`/tutorials/${categorySlug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#6b7280', textDecoration: 'none' }}>
          <ChevronLeft size={14} /> Back to {tutorial?.category?.name || 'Tutorials'}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 45, background: '#16a34a', color: 'white', border: 'none', borderRadius: '50px', padding: '0.6rem 1rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,163,74,0.4)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}
        className="sidebar-toggle"
      >
        <BookOpen size={16} />
        <span>{open ? 'Close' : 'Contents'}</span>
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} style={{ display: 'none' }} />
      )}

      {/* Desktop sidebar */}
      <aside style={{ width: '280px', flexShrink: 0, height: 'calc(100vh - 64px)', position: 'sticky', top: '64px', borderRight: '1px solid #e5e7eb', background: 'white', overflowY: 'auto', overflowX: 'hidden' }} className="desktop-sidebar">
        <DrawerContent />
      </aside>

      {/* Mobile drawer */}
      <div style={{ position: 'fixed', left: open ? 0 : '-320px', top: 0, bottom: 0, width: 300, background: 'white', zIndex: 50, boxShadow: '4px 0 24px rgba(0,0,0,0.15)', transition: 'left 0.3s ease', overflowY: 'auto' }} className="mobile-drawer">
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>Table of Contents</span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={20} /></button>
        </div>
        <DrawerContent />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-sidebar { display: none !important; }
          .sidebar-toggle { display: flex !important; }
          .mobile-drawer { display: block !important; }
        }
        @media (min-width: 1025px) {
          .sidebar-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </>
  );
}
