'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useTasks } from '@/hooks/useTasks';
import { TaskWithCategory } from '@/lib/types';
import { useSelectedTask } from '@/hooks/useSelectedTask';

type Props = {
  row: Row<TaskWithCategory>;
};

export function DataTableRowActions({ row }: Props) {
  const task = row.original;
  const { deleteTask } = useTasks();
  const { setSelectedTask } = useSelectedTask();

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setSelectedTask(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(task.id)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
