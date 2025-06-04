'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
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
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/app/app/data-table/schema';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from '@/components/ui/DataTablePagination';
import { DataTableToolbar } from '@/app/app/data-table/DataTableToolbar';
import { useSelectedTask } from '@/hooks/useSelectedTask';

interface DataTableProps<TData extends Task, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Task, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tableData, setTableData] = React.useState<TData[]>(data);
  const { setSelectedTask } = useSelectedTask();

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row) => row.id,
  });

  // Convenient for ID lookup
  const dataIds = React.useMemo(() => tableData.map((row) => row.id), [tableData]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setTableData((prev) => {
        const oldIndex = dataIds.indexOf(active.id as string);
        const newIndex = dataIds.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
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
  const DraggableRow = ({ row }: { row: Row<TData> }) => {
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
      <DataTableToolbar table={table} />
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
      <DataTablePagination table={table} />
    </div>
  );
}
