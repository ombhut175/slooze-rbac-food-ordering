/**
 * useAllUsers Hook
 * Fetches all users in the system (ADMIN only)
 * Uses SWR for caching and automatic revalidation
 */

import useSWR from 'swr';
import { swrFetcher } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { PublicUser } from '@/lib/api/users';

const USERS_ENDPOINT = 'users';

export function useAllUsers() {
  hackLog.dev('useAllUsers hook initialized');

  const { data, error, isLoading, mutate } = useSWR<PublicUser[]>(
    USERS_ENDPOINT,
    () => swrFetcher(USERS_ENDPOINT) as Promise<PublicUser[]>,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess('GET', USERS_ENDPOINT, {
          count: data?.length || 0,
        });
      },
      onError: (err) => {
        hackLog.apiError('GET', USERS_ENDPOINT, err);
        handleError(err, {
          toast: true,
          fallbackMessage: 'Failed to load users',
        });
      },
    }
  );

  return {
    users: data || [],
    isLoading,
    error,
    isEmpty: !isLoading && (!data || data.length === 0),
    refetch: mutate,
  };
}
