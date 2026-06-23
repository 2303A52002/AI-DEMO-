'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/frontend/components/ui/Toast';

export function useCompare() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { success, info } = useToast();

  // Load state and prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
    const urlIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];

    if (urlIds.length > 0) {
      setComparedIds(urlIds);
      localStorage.setItem('campusiq-compare', JSON.stringify(urlIds));
    } else {
      const stored = localStorage.getItem('campusiq-compare');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as string[];
          if (parsed.length > 0) {
            setComparedIds(parsed);
            // Sync URL with stored items ONLY if we are on the compare page
            if (pathname === '/compare') {
              const params = new URLSearchParams();
              params.set('ids', parsed.join(','));
              router.replace(`/compare?${params.toString()}`);
            }
          }
        } catch {
          localStorage.removeItem('campusiq-compare');
        }
      }
    }
  }, [searchParams, router, pathname]);

  const addToCompare = (id: string, name?: string) => {
    if (comparedIds.includes(id)) {
      info('Already Added', `${name || 'College'} is already in your comparison list.`);
      return;
    }

    if (comparedIds.length >= 3) {
      info('Limit Reached', 'You can compare up to 3 colleges side by side.');
      return;
    }

    const updated = [...comparedIds, id];
    setComparedIds(updated);
    localStorage.setItem('campusiq-compare', JSON.stringify(updated));

    const params = new URLSearchParams(searchParams.toString());
    params.set('ids', updated.join(','));
    router.push(`/compare?${params.toString()}`);
    success('Added to Compare', `${name || 'College'} added to your comparison list.`);
  };

  const removeFromCompare = (id: string, name?: string) => {
    const updated = comparedIds.filter((x) => x !== id);
    setComparedIds(updated);
    localStorage.setItem('campusiq-compare', JSON.stringify(updated));

    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      params.set('ids', updated.join(','));
    } else {
      params.delete('ids');
    }

    router.push(`/compare?${params.toString()}`);
    info('Removed from Compare', `${name || 'College'} removed from comparison.`);
  };

  const clearCompare = () => {
    setComparedIds([]);
    localStorage.removeItem('campusiq-compare');
    router.push('/compare');
    info('Comparison Cleared', 'All colleges removed from comparison.');
  };

  return {
    comparedIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare: (id: string) => comparedIds.includes(id),
    isMounted,
  };
}
export default useCompare;
