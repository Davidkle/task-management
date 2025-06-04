'use client';

import { Folder, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

type Category = {
  id: string;
  name: string;
  color: string;
};

export function NavProjects({ categories: initialCategories }: { categories: Category[] }) {
  const { isMobile } = useSidebar();
  const [categories, setCategories] = React.useState(initialCategories);

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setCategories((prev) => {
        const oldIndex = prev.findIndex((cat) => cat.id === active.id);
        const newIndex = prev.findIndex((cat) => cat.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  // Draggable menu item
  const DraggableMenuItem = ({ category }: { category: Category }) => {
    const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({ id: category.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.8 : 1,
      zIndex: isDragging ? 1 : 0,
      position: 'relative',
    } as React.CSSProperties;
    return (
      <SidebarMenuItem ref={setNodeRef} style={style} key={category.id} {...attributes} {...listeners}>
        <SidebarMenuButton asChild>
          <Link href={`/app/categories/${category.id}`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: category.color }}></div>
              <span>{category.name}</span>
            </div>
          </Link>
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
    );
  };

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
      <DndContext collisionDetection={closestCenter} modifiers={[]} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <SidebarMenu>
            {categories.map((category) => (
              <DraggableMenuItem key={category.id} category={category} />
            ))}
          </SidebarMenu>
        </SortableContext>
      </DndContext>
    </SidebarGroup>
  );
}
