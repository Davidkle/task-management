'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { statuses, sampleData } from '@/app/app/data-table/data';
import { DataTableFacetedFilter } from '@/components/ui/DataTableFacetedFilter';
import { TaskCreateModal } from '@/app/app/data-table/TaskCreateModal';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  // TODO: Memoize this
  const categoryOptions = sampleData.categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter column={table.getColumn('status')} title="Status" options={statuses} />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter column={table.getColumn('category')} title="Category" options={categoryOptions} />
        )}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setOpen(true)}>
          Add Task
        </Button>
      </div>
      <TaskCreateModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
