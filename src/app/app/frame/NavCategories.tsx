'use client';

import { Folder, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import React from 'react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  PointerSensor,
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
import { CategoryCreateModal } from '@/app/app/frame/CategoryCreateModal';
import { useSelectedCategory } from '@/hooks/useSelectedCategory';

type Category = {
  id: string;
  name: string;
  color: string;
};

export function NavCategories({ categories: initialCategories }: { categories: Category[] }) {
  const { isMobile } = useSidebar();
  const [categories, setCategories] = React.useState(initialCategories);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const { setSelectedCategory } = useSelectedCategory();

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

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

  function handleCreateCategory(data: { name: string; color: string }) {
    // TODO: Replace with API call
    setCategories((prev) => [...prev, { id: Math.random().toString(36).slice(2), ...data }]);
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
      <SidebarMenuItem
        ref={setNodeRef}
        style={style}
        onClick={() => {
          setSelectedCategory(category);
        }}
        key={category.id}
        {...attributes}
        {...listeners}
      >
        <SidebarMenuButton asChild>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: category.color }}></div>
            <span>{category.name}</span>
          </div>
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
          <Button variant="default" className="w-12 h-7" size="icon" onClick={() => setShowCreateModal(true)}>
            <Plus />
          </Button>
        </div>
      </SidebarGroupLabel>
      {/* View All item (not draggable) */}
      <SidebarMenu>
        <SidebarMenuItem onClick={() => setSelectedCategory(null)} className="font-normal" key="view-all">
          <SidebarMenuButton asChild>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm border"></div>
              <span>View All</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <DndContext
        id="dnd-category-menu"
        collisionDetection={closestCenter}
        modifiers={[]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <SidebarMenu>
            {categories.map((category) => (
              <DraggableMenuItem key={category.id} category={category} />
            ))}
          </SidebarMenu>
        </SortableContext>
      </DndContext>
      <CategoryCreateModal open={showCreateModal} onOpenChange={setShowCreateModal} onSubmit={handleCreateCategory} />
    </SidebarGroup>
  );
}
