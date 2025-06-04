import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskCreateModal({ open, onOpenChange }: TaskCreateModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [categoryId, setCategoryId] = React.useState<string | undefined>();

  const { createTaskAsync, isCreating } = useTasks();
  const { categories } = useCategories();

  // Validation: title and description must be non-empty
  const isFormValid = title.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    try {
      await createTaskAsync({ title, description, categoryId });
      setTitle('');
      setDescription('');
      setCategoryId('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea
            placeholder="Description (optional)"
            className="h-24 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
        <div className="flex justify-end gap-8 mt-4">
          <Button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={!isFormValid || isCreating}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
