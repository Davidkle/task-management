'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

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
import { Button } from '@/components/ui/button';

export function ProfileSwitcher({
  profiles,
}: {
  profiles: {
    name: string;
    email: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeProfile, setActiveProfile] = React.useState(profiles[0]);

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
            {profiles.map((profile, index) => (
              <DropdownMenuItem key={profile.name} onClick={() => setActiveProfile(profile)} className="gap-2 p-2">
                {profile.name}
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
