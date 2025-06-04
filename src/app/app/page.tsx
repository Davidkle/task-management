import { AppSidebar } from '@/app/app/frame/AppSidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from 'components/ui/breadcrumb';
import { Separator } from 'components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from 'components/ui/sidebar';

import { Metadata } from 'next';
import { z } from 'zod';

import { columns } from '@/app/app/data-table/columns';
import { DataTable } from '@/app/app/data-table/DataTable';
import { taskSchema } from '@/app/app/data-table/schema';
import exampleTasks from '@/app/app/data-table/tasks.json';
import { ViewTask } from '@/app/app/frame/ViewTask';

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'A todo list app',
};

export default function Page() {
  const tasks = z.array(taskSchema).parse(exampleTasks);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">TaskFlow</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex px-4 pb-[16px] relative">
          <ViewTask />
          <DataTable data={tasks} columns={columns} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
