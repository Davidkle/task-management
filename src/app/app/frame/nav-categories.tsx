'use client';

import { Folder, Forward, MoreHorizontal, Plus, Trash2, type LucideIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from 'components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function NavProjects({
  categories,
}: {
  categories: {
    id: string;
    name: string;
    color: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="mb-4">
        <div className="w-full flex items-center justify-between">
          <div>Categories</div>
          <Button variant="default" className="w-12 h-7" size="icon">
            <Plus />
          </Button>
        </div>
      </SidebarGroupLabel>
      <SidebarMenu>
        {categories.map((category) => (
          <SidebarMenuItem key={category.name}>
            <SidebarMenuButton asChild>
              <a href={`/app/categories/${category.id}`}>
                <span>{category.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Tasks</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Category</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
