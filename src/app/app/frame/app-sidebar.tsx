'use client';

import * as React from 'react';

import { NavProjects } from '@/app/app/frame/nav-categories';
import { ProfileSwitcher } from '@/app/app/frame/profile-switcher';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from 'components/ui/sidebar';
import { sampleData } from '@/app/app/data-table/data';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // TODO: support multi session
  // TODO: pull categories
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProfileSwitcher profiles={sampleData.profiles} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects categories={sampleData.categories} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
