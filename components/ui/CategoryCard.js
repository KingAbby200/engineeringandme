'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Layers } from 'lucide-react';

export default function CategoryCard({ category }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/tutorials/${category.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          padding: '1.25rem',
          background: 'white',
          border: '1.5px solid #e5e7eb',
          borderRadius: 10,
          textAlign: 'center',
          transition: 'all 0.2s',
          cursor: 'pointer',
          borderColor: isHovered ? '#16a34a' : '#e5e7eb',
          transform: isHovered ? 'translateY(-2px)' : 'none',
          boxShadow: isHovered ? '0 4px 12px rgba(22,163,74,0.15)' : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {category.icon || <Layers size={32} color="#16a34a" />}
        </div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.3 }}>
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
