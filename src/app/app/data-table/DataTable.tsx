'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

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
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskWithCategory } from '@/lib/types';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from '@/components/ui/DataTablePagination';
import { DataTableToolbar } from '@/app/app/data-table/DataTableToolbar';
import { useSelectedTask } from '@/hooks/useSelectedTask';

import { columns } from '@/app/app/data-table/columns';
import { useTasks } from '@/hooks/useTasks';
import { reorderWithPosition } from '@/lib/ordering';
import { useDebounce } from '@/hooks/useDebounce';

export function DataTable() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<string[]>([]);
  const [categoryId, setCategoryId] = React.useState<string[]>([]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tableData, setTableData] = React.useState<TaskWithCategory[]>([]);

  const { setSelectedTask } = useSelectedTask();

  const debouncedSearch = useDebounce(search, 300);
  const debouncedStatus = useDebounce(status, 300);
  const debouncedCategoryId = useDebounce(categoryId, 300);

  const [pageIndex, setPageIndex] = React.useState(0);

  const { tasks, updateTaskAsync, pagination } = useTasks({
    search: debouncedSearch || undefined,
    status: debouncedStatus.length > 0 ? debouncedStatus.join(',') : undefined,
    categoryId: debouncedCategoryId.length > 0 ? debouncedCategoryId.join(',') : undefined,
    page: pageIndex + 1,
  });

  // Sync tableData with tasks
  React.useEffect(() => {
    if (tasks) {
      setTableData(tasks);
    }
  }, [tasks]);

  const table = useReactTable({
    data: tableData,
    columns: columns as ColumnDef<TaskWithCategory>[],
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize: 25,
      },
    },
    enableRowSelection: true,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row) => row.id,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater(table.getState().pagination);
        setPageIndex(newState.pageIndex);
      }
    },
  });

  // Convenient for ID lookup
  const dataIds = React.useMemo(() => tableData.map((row) => row.id), [tableData]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setTableData((prev) =>
        reorderWithPosition(prev, active.id as string, over.id as string, (id, newPosition) => {
          // Fire and forget
          updateTaskAsync({ id, input: { position: newPosition } });
        })
      );
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Delay the activation to detect on click vs drag
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  // Draggable row
  const DraggableRow = ({ row }: { row: Row<TaskWithCategory> }) => {
    const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({ id: row.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.8 : 1,
      zIndex: isDragging ? 1 : 0,
      position: 'relative',
    } as React.CSSProperties;

    return (
      <TableRow
        ref={setNodeRef}
        style={style}
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
        onClick={() => {
          setSelectedTask(row.original);
        }}
        {...attributes}
        {...listeners}
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </TableRow>
    );
  };

  // 64px is the height of the header
  // 16px is the bottom padding of the page
  return (
    <div className="flex flex-col gap-4 w-full h-[calc(100vh-80px)]">
      <DataTableToolbar
        table={table}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
      />
      <div className="rounded-md flex flex-col flex-1 border overflow-hidden">
        <DndContext
          id="dnd-task-table"
          collisionDetection={closestCenter}
          modifiers={[]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table className="relative">
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
      {pagination && <DataTablePagination table={table} pageInfo={pagination} />}
    </div>
  );
}
