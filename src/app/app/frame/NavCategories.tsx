'use client';

import { Folder, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { CategoryCreateUpdateModal } from '@/app/app/frame/CategoryCreateUpdateModal';
import { useSelectedCategory } from '@/hooks/useSelectedCategory';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@prisma/client';

export function NavCategories() {
  const { isMobile } = useSidebar();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const { setSelectedCategory } = useSelectedCategory();

  const {
    categories: categoriesFromServer,
    createCategoryAsync,
    updateCategoryAsync,
    deleteCategoryAsync,
  } = useCategories();

  React.useEffect(() => {
    if (categoriesFromServer) {
      setCategories(categoriesFromServer);
    }
  }, [categoriesFromServer]);

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

  async function handleCreateOrUpdateCategory(data: { id?: string; name: string; color: string }) {
    if (data.id) {
      await updateCategoryAsync({ id: data.id, input: { name: data.name, color: data.color } });
      setEditingCategory(null);
    } else {
      await createCategoryAsync({ name: data.name, color: data.color });
      setShowCreateModal(false);
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    await deleteCategoryAsync(categoryId);
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    setSelectedCategory(null);
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
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setEditingCategory(category);
              }}
            >
              <Pencil className="text-muted-foreground" />
              <span>Edit Category</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
            >
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
      <CategoryCreateUpdateModal
        open={showCreateModal || !!editingCategory}
        onOpenChange={(open) => {
          setShowCreateModal(open && !editingCategory);
          if (!open) setEditingCategory(null);
        }}
        onSubmit={handleCreateOrUpdateCategory}
        category={editingCategory}
      />
    </SidebarGroup>
  );
}
