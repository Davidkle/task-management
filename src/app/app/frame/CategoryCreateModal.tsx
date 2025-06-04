import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const COLOR_OPTIONS = [
  '#fbcfe8', // pink-200
  '#f9a8d4', // pink-300
  '#a5b4fc', // indigo-300
  '#bae6fd', // sky-200
  '#bbf7d0', // green-200
  '#fef9c3', // yellow-100
  '#fde68a', // yellow-300
  '#fdba74', // orange-300
  '#fca5a5', // red-300
  '#fdcfe8', // rose-200
  '#c7d2fe', // indigo-200
  '#d1fae5', // emerald-100
  '#fef3c7', // amber-100
  '#fcd34d', // amber-300
  '#a7f3d0', // green-200
  '#f0abfc', // fuchsia-300
  '#f5d0fe', // fuchsia-200
  '#bfdbfe', // blue-200
  '#6ee7b7', // emerald-300
];

interface CategoryCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; color: string }) => void;
}

export function CategoryCreateModal({ open, onOpenChange, onSubmit }: CategoryCreateModalProps) {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState<string | undefined>();
  const [touched, setTouched] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (name && color) {
      onSubmit({ name, color });
      setName('');
      setColor(undefined);

      setTouched(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <div>
            <div className="mb-2 font-medium">Color</div>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-primary' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={c}
                />
              ))}
            </div>
            {touched && !color && <div className="text-red-500 text-xs mt-1">Color is required</div>}
          </div>
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
              disabled={!name || !color}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
