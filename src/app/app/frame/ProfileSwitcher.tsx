'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus, LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from 'components/ui/sidebar';
import Link from 'next/link';
import { UserProfile, useUserProfiles } from '@/hooks/useUser';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function ProfileSwitcher() {
  const { isMobile } = useSidebar();
  const [activeProfile, setActiveProfile] = React.useState<UserProfile | null>(null);
  const { profiles, setActiveProfileAsync } = useUserProfiles();
  const router = useRouter();

  useEffect(() => {
    const newActiveProfile = profiles?.find((p) => p.active);
    if (newActiveProfile) {
      setActiveProfile(newActiveProfile);
    }

    if (profiles?.length === 0) {
      router.push('/login');
    }
  }, [profiles]);

  if (!activeProfile) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeProfile.name}</span>
                <span className="truncate text-xs">{activeProfile.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Profiles</DropdownMenuLabel>
            {profiles?.map((profile, index) => (
              <DropdownMenuItem
                key={profile.id}
                onClick={() => setActiveProfileAsync(profile.id)}
                className="gap-2 p-2 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  {profile.active && <div className="size-2 rounded-full bg-blue-500" />}
                  <span>{profile.name}</span>
                </div>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (profile.sessionToken) {
                      await authClient.revokeSession({ token: profile.sessionToken });
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <LogOut className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <Link href="/login">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">Add profile</div>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
