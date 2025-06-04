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

// Set active profile
const setActiveProfile = async (userId: string): Promise<void> => {
  const res = await fetch(`/api/user/setActiveProfile/${userId}`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to set active profile');
};

export function useUserProfiles() {
  const queryClient = useQueryClient();

  // Fetch all user profiles
  const profilesQuery = useQuery<UserProfile[]>({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });

  // Set active profile mutation
  const setActiveProfileMutation = useMutation({
    mutationFn: setActiveProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfiles'] }),
  });

  return {
    // List
    profiles: profilesQuery.data,
    isLoading: profilesQuery.isLoading,
    error: profilesQuery.error,

    // Set active
    setActiveProfileAsync: setActiveProfileMutation.mutateAsync,
    isSettingActive: setActiveProfileMutation.status === 'pending',
  };
}
