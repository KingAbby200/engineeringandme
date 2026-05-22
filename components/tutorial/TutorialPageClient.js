'use client';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export default function TutorialPageClient({ tutorialId, pageId }) {
  const { user } = useAuthStore();
  const tracked = useRef(false);

  // Reading progress bar
  useEffect(() => {
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.style.width = '0%';
    document.body.appendChild(bar);

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = `${Math.min(progress, 100)}%`;

      // Mark as visited when 70% read
      if (progress > 70 && !tracked.current && user && tutorialId && pageId) {
        tracked.current = true;
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tutorialId, pageId }),
        }).catch(() => {});
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      bar.remove();
    };
  }, [user, tutorialId, pageId]);

  return null;
}
