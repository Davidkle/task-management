'use client';

import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useState } from 'react';
import { TaskStatus } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/ui/DataTableFacetedFilter';
import { TaskCreateModal } from '@/app/app/data-table/TaskCreateModal';
import { useCategories } from '@/hooks/useCategories';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  setSearch: (value: string) => void;
  status: string[];
  setStatus: (value: string[]) => void;
  categoryId: string[];
  setCategoryId: (value: string[]) => void;
}

const statuses = Object.values(TaskStatus).map((status) => ({
  label: status,
  value: status,
}));

export function DataTableToolbar<TData>({
  table,
  search,
  setSearch,
  status,
  setStatus,
  categoryId,
  setCategoryId,
}: DataTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);
  const isFiltered = !!search || status.length > 0 || categoryId.length > 0;
  const { categories } = useCategories();

  const categoryOptions = React.useMemo(
    () =>
      categories?.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? [],
    [categories]
  );

  // Sync lifted state to table column filters
  React.useEffect(() => {
    table.getColumn('title')?.setFilterValue(search);
  }, [search, table]);

  React.useEffect(() => {
    table.getColumn('status')?.setFilterValue(status.length > 0 ? status : undefined);
  }, [status, table]);

  React.useEffect(() => {
    table.getColumn('category')?.setFilterValue(categoryId.length > 0 ? categoryId : undefined);
  }, [categoryId, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter tasks..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
            value={status}
            onChange={setStatus}
          />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="Category"
            options={categoryOptions}
            value={categoryId}
            onChange={setCategoryId}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              setStatus([]);
              setCategoryId([]);
              table.getColumn('title')?.setFilterValue('');
              table.getColumn('status')?.setFilterValue(undefined);
              table.getColumn('category')?.setFilterValue(undefined);
            }}
          >
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
