'use client';

import * as React from 'react';

import { NavCategories } from '@/app/app/frame/NavCategories';
import { ProfileSwitcher } from '@/app/app/frame/ProfileSwitcher';
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
        <NavCategories categories={sampleData.categories} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
