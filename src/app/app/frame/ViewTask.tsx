'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useSelectedTask } from '@/hooks/useSelectedTask';

export function ViewTask() {
  const { selectedTask, setSelectedTask } = useSelectedTask();

  return (
    <Sheet
      open={!!selectedTask}
      onOpenChange={(open) => {
        if (!open) setSelectedTask(null);
      }}
    >
      <SheetContent side="right" overlay={false}>
        <SheetHeader>
          <SheetTitle>{selectedTask?.title}</SheetTitle>
        </SheetHeader>
        {/* Add more task details here as needed */}
      </SheetContent>
    </Sheet>
  );
}
