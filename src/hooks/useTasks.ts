import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  categoryId?: string;
  position: number;
  userId: string;
};

export type TaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  categoryId?: string;
};

export type TaskUpdateInput = Partial<TaskInput>;

const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch('/api/tasks');
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to fetch tasks');
  return data.data;
};

const fetchTask = async (id: string): Promise<Task> => {
  const res = await fetch(`/api/tasks/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to fetch task');
  return data.data;
};

const createTask = async (input: TaskInput): Promise<Task> => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to create task');
  return data.data;
};

const updateTask = async ({ id, input }: { id: string; input: TaskUpdateInput }): Promise<Task> => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to update task');
  return data.data;
};

const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to delete task');
};

export function useTasks() {
  const queryClient = useQueryClient();

  // Fetch all tasks
  const tasksQuery = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // Create a task
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // Update a task
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // Delete a task
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // Fetch a single task (on demand)
  const getTask = (id: string) =>
    useQuery<Task>({
      queryKey: ['tasks', id],
      queryFn: () => fetchTask(id),
      enabled: !!id,
    });

  return {
    // List
    tasks: tasksQuery.data,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,

    // Create
    createTask: createTaskMutation.mutate,
    createTaskAsync: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.status === 'pending',

    // Update
    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.status === 'pending',

    // Delete
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.status === 'pending',

    // Single task fetcher (usage: const { data, isLoading } = getTask(id))
    getTask,
  };
}
