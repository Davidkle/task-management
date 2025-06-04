import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/lib/types';

type Props<TData> = {
  table: Table<TData>;
  pageInfo: Pagination;
};

export function DataTablePagination<TData>({ table, pageInfo }: Props<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = pageInfo.total;

  if (totalItems === 0) {
    return null;
  }
  const pageNumberToDisplay = pageIndex + 1;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min(pageNumberToDisplay * pageSize, totalItems);

  const canGetPreviousPage = pageIndex > 0;
  const canGetNextPage = pageNumberToDisplay < totalPages;

  return (
    <div className="flex items-center gap-6 px-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            table.previousPage();
          }}
          disabled={!canGetPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select
          value={`${pageNumberToDisplay}`}
          onValueChange={(value) => {
            table.setPageIndex(Number(value) - 1);
          }}
        >
          <SelectTrigger className="h-8 w-16 px-2">
            <SelectValue placeholder={`${pageNumberToDisplay}`} />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalPages }, (_, i) => {
              return (
                <SelectItem key={i + 1} value={`${i + 1}`}>
                  {i + 1}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            table.nextPage();
          }}
          disabled={!canGetNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        {startItem} - {endItem} of {totalItems}
      </div>
    </div>
  );
}
