import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SavedCollege } from '@/shared/types';
import { useToast } from '@/frontend/components/ui/Toast';
import { useSession } from 'next-auth/react';

export function useSaved() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { success, error } = useToast();

  // 1. Fetch user's saved colleges (Only fetch if authenticated)
  const { data: savedList = [], isLoading } = useQuery<SavedCollege[]>({
    queryKey: ['saved'],
    queryFn: async () => {
      const res = await fetch('/api/saved');
      if (!res.ok) {
        // If unauthenticated or token expires, return empty array silently
        if (res.status === 401) {
          return [];
        }
        throw new Error('Failed to fetch saved colleges');
      }
      return res.json();
    },
    enabled: !!session?.user,
  });

  // Helper checking if a college is bookmarked
  const isSaved = (collegeId: string) => {
    return savedList.some((item) => item.collegeId === collegeId);
  };

  // 2. Mutator containing optimistic UI updates
  const toggleMutation = useMutation({
    mutationFn: async ({ collegeId, currentlySaved }: { collegeId: string; currentlySaved: boolean }) => {
      const method = currentlySaved ? 'DELETE' : 'POST';
      const res = await fetch('/api/saved', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || (currentlySaved ? 'Failed to remove college' : 'Failed to save college'));
      }
      return res.json();
    },
    // Perform optimistic updates
    onMutate: async ({ collegeId, currentlySaved }) => {
      // Cancel outgoing queries to avoid overwrites
      await queryClient.cancelQueries({ queryKey: ['saved'] });

      // Save previous state for rollback
      const previousSaved = queryClient.getQueryData<SavedCollege[]>(['saved']) || [];

      // Optimistically alter state
      if (currentlySaved) {
        queryClient.setQueryData<SavedCollege[]>(
          ['saved'],
          previousSaved.filter((item) => item.collegeId !== collegeId)
        );
      } else {
        const tempRecord: SavedCollege = {
          id: `temp-${Date.now()}`,
          userId: session?.user?.id || 'temp-user-id',
          collegeId,
          savedAt: new Date(),
        };
        queryClient.setQueryData<SavedCollege[]>(['saved'], [...previousSaved, tempRecord]);
      }

      return { previousSaved };
    },
    onError: (err, variables, context) => {
      // Roll back to the original database state on error
      if (context?.previousSaved) {
        queryClient.setQueryData(['saved'], context.previousSaved);
      }
      error('Authentication Required', 'Please log in to save colleges.');
    },
    onSuccess: (data, variables) => {
      const { currentlySaved } = variables;
      if (currentlySaved) {
        success('College Removed', 'College removed from your saved list.');
      } else {
        success('College Saved', 'College added to your saved list.');
      }
    },
    onSettled: () => {
      // Always refetch saved items list to synchronize with DB state
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });

  return {
    savedList,
    isLoading,
    isSaved,
    toggleSave: (collegeId: string) => {
      if (!session?.user) {
        error('Action Unauthorized', 'Please sign in to bookmark colleges.');
        return;
      }
      const currentlySaved = isSaved(collegeId);
      toggleMutation.mutate({ collegeId, currentlySaved });
    },
    isToggling: toggleMutation.isPending,
  };
}
export default useSaved;
