import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// User profile type based on API response
export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  active: boolean;
  sessionToken?: string;
};

// Fetch all user profiles
const fetchUserProfiles = async (): Promise<UserProfile[]> => {
  const res = await fetch('/api/user');
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch user profiles');
  return data.profiles;
};

export function useUserProfiles() {
  const queryClient = useQueryClient();

  // Fetch all user profiles
  const profilesQuery = useQuery<UserProfile[]>({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });
  return {
    // List
    profiles: profilesQuery.data,
    isLoading: profilesQuery.isLoading,
    error: profilesQuery.error,
  };
}
