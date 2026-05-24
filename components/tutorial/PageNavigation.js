'use client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export default function PageNavigation({ pageUrl, prevPage, nextPage, category }) {
  return (
    <nav style={{ display: 'flex', gap: '1rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1.5px solid #e5e7eb', flexWrap: 'wrap' }}>
      {prevPage ? (
        <Link
          href={`${pageUrl}/${prevPage.slug}`}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '1rem 1.25rem',
            border: '1.5px solid #e5e7eb',
            borderRadius: 10,
            textDecoration: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#16a34a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <ChevronLeft size={13} /> Previous
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
            {prevPage.title}
          </span>
        </Link>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {nextPage ? (
        <Link
          href={`${pageUrl}/${nextPage.slug}`}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '1rem 1.25rem',
            border: '1.5px solid #e5e7eb',
            borderRadius: 10,
            textDecoration: 'none',
            background: 'white',
            transition: 'all 0.15s',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            textAlign: 'right',
            borderColor: '#16a34a',
            backgroundColor: '#f0fdf4',
          }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              justifyContent: 'flex-end',
            }}
          >
            Next <ChevronRight size={13} />
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
            {nextPage.title}
          </span>
        </Link>
      ) : (
        <div
          style={{
            flex: 1,
            minWidth: 200,
            padding: '1rem 1.25rem',
            border: '1.5px solid #bbf7d0',
            borderRadius: 10,
            background: '#f0fdf4',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle size={32} color="#16a34a" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16a34a' }}>Tutorial Complete!</span>
          <Link href={`/tutorials/${category}`} style={{ fontSize: '0.8rem', color: '#6b7280', textDecoration: 'none' }}>
            Browse more →
          </Link>
        </div>
      )}
    </nav>
  );
}
