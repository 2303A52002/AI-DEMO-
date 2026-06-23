import { useInfiniteQuery } from '@tanstack/react-query';
import { CollegesResponse } from '@/shared/types';

interface UseCollegesFilters {
  search?: string;
  state?: string;
  minFees?: number;
  maxFees?: number;
  rating?: number;
  limit?: number;
}

export function useColleges(filters: UseCollegesFilters) {
  return useInfiniteQuery<CollegesResponse>({
    queryKey: ['colleges', filters],
    queryFn: async ({ pageParam }) => {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.state) queryParams.set('state', filters.state);
      if (filters.minFees !== undefined) queryParams.set('minFees', filters.minFees.toString());
      if (filters.maxFees !== undefined) queryParams.set('maxFees', filters.maxFees.toString());
      if (filters.rating !== undefined) queryParams.set('rating', filters.rating.toString());
      if (filters.limit !== undefined) queryParams.set('limit', filters.limit.toString());
      if (pageParam) {
        queryParams.set('cursor', pageParam as string);
      }

      const res = await fetch(`/api/colleges?${queryParams.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch colleges');
      }
      return res.json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
}
export default useColleges;
