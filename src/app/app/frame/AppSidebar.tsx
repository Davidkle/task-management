'use client';

import * as React from 'react';

import { NavCategories } from '@/app/app/frame/NavCategories';
import { ProfileSwitcher } from '@/app/app/frame/ProfileSwitcher';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from 'components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProfileSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavCategories />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
