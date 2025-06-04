'use client';

import * as React from 'react';

import { NavProjects } from '@/app/app/frame/nav-categories';
import { ProfileSwitcher } from '@/app/app/frame/profile-switcher';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from 'components/ui/sidebar';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  profiles: [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
    {
      name: 'Jack Smith',
      email: 'jack.smith@example.com',
    },
  ],
  categories: [
    {
      id: '1',
      name: 'Playground',
      color: '#ebaf16',
    },
    {
      id: '2',
      name: 'Models',
      color: '#3B82F6',
    },
    {
      id: '3',
      name: 'Documentation',
      color: '#8311f5',
    },
    {
      id: '4',
      name: 'Settings',
      color: '#f6673b',
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProfileSwitcher profiles={data.profiles} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects categories={data.categories} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
