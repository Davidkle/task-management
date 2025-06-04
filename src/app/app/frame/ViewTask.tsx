'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

import { useSelectedTask } from '@/hooks/useSelectedTask';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { showToast } from '@/lib/toast';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import React from 'react';
import { TaskStatus } from '@prisma/client';

const STATUS_OPTIONS = Object.values(TaskStatus).map((status) => ({
  value: status,
  label: status,
}));

// Helper to normalize date to YYYY-MM-DD string or ''
function normalizeDate(date: string | Date | undefined | null): string {
  if (!date) return '';
  if (typeof date === 'string') return date.slice(0, 10);
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return '';
}

export function ViewTask() {
  const { selectedTask, setSelectedTask } = useSelectedTask();
  const { updateTaskAsync, isUpdating } = useTasks();
  const { categories } = useCategories();

  // Local state for editing
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState<string | undefined>();
  const [status, setStatus] = React.useState<TaskStatus>('PENDING');
  const [categoryId, setCategoryId] = React.useState<string | undefined>();

  // Track initial values for dirty check
  React.useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      let dueDateStr = '';
      const dueDateVal = selectedTask.dueDate as string | Date | undefined;
      if (dueDateVal) {
        if (typeof dueDateVal === 'string') {
          dueDateStr = dueDateVal.slice(0, 10);
        } else if (dueDateVal instanceof Date) {
          dueDateStr = dueDateVal.toISOString().slice(0, 10);
        }
      }
      setDueDate(dueDateStr);
      setStatus(selectedTask.status ? selectedTask.status : 'PENDING');
      setCategoryId(selectedTask.category?.id);
    }
  }, [selectedTask]);

  // Group initial and current values
  const initial = {
    title: selectedTask?.title || '',
    description: selectedTask?.description || '',
    dueDate: normalizeDate(selectedTask?.dueDate),
    status: selectedTask?.status ? String(selectedTask.status) : 'PENDING',
    categoryId: selectedTask?.category?.id || '',
  };

  const current = {
    title,
    description,
    dueDate: dueDate || '',
    status,
    categoryId: categoryId || '',
  };

  // Dirty check by comparing each field
  const isDirty =
    selectedTask &&
    Object.keys(initial).some((key) => initial[key as keyof typeof initial] !== current[key as keyof typeof current]);

  const isFormValid = title.trim().length > 0 && description.trim().length > 0 && isDirty;

  const handleCancel = () => {
    setSelectedTask(null);
  };

  const handleSubmit = async () => {
    if (!selectedTask) return;
    if (!isFormValid) return;
    try {
      await updateTaskAsync({
        id: selectedTask.id,
        input: {
          title,
          description,
          dueDate: dueDate ? new Date(dueDate) : null,
          status: status as TaskStatus,
          categoryId: categoryId || undefined,
        },
      });
      setSelectedTask(null);
    } catch (error) {
      showToast({ id: 'failed-to-update-task', message: 'Failed to update task', type: 'error' });
    }
  };

  return (
    <Sheet
      open={!!selectedTask}
      onOpenChange={(open) => {
        if (!open) setSelectedTask(null);
      }}
    >
      <SheetContent side="right" overlay={false} className="max-w-md w-full">
        <SheetHeader>
          <SheetTitle>Task</SheetTitle>
        </SheetHeader>
        {selectedTask && (
          <form className="flex flex-col gap-4 mt-4">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea
              placeholder="Description"
              className="h-24 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {/* Due Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={'w-full justify-start text-left font-normal' + (!dueDate ? ' text-muted-foreground' : '')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(new Date(dueDate), 'PPP') : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate ? new Date(dueDate) : undefined}
                  onSelect={(date) => setDueDate(date ? date.toISOString().slice(0, 10) : undefined)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={!categories || categories.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        )}
        <div className="flex justify-end gap-8 mt-8">
          <Button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={handleCancel}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={!isFormValid || isUpdating}
          >
            Submit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
