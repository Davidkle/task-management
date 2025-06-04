import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PaginatedResponse, TaskWithCategory } from '@/lib/types';
import type { Task } from '@prisma/client';

export type TaskUpdateInput = Partial<Task>;
export type TaskCreateInput = Partial<Task>;

const fetchTasks = async (params?: {
  search?: string;
  status?: string | string[];
  categoryId?: string | string[];
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<TaskWithCategory>> => {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) {
    const status = Array.isArray(params.status) ? params.status.join(',') : params.status;
    query.set('status', status);
  }
  if (params?.categoryId) {
    const categoryId = Array.isArray(params.categoryId) ? params.categoryId.join(',') : params.categoryId;
    query.set('categoryId', categoryId);
  }
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());

  const res = await fetch(`/api/tasks${query.toString() ? `?${query.toString()}` : ''}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to fetch tasks');
  return data;
};

const fetchTask = async (id: string): Promise<TaskWithCategory> => {
  const res = await fetch(`/api/tasks/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to fetch task');

  return data.data;
};

const createTask = async (input: TaskCreateInput, categoryId?: string): Promise<TaskWithCategory> => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: input, categoryId }),
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

export function useTasks(filters?: {
  search?: string;
  status?: string | string[];
  categoryId?: string | string[];
  page?: number;
  limit?: number;
}) {
  const queryClient = useQueryClient();

  // Fetch all tasks with filters
  const tasksQuery = useQuery<PaginatedResponse<TaskWithCategory>>({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
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
    useQuery<TaskWithCategory>({
      queryKey: ['tasks', id],
      queryFn: () => fetchTask(id),
      enabled: !!id,
    });

  return {
    // List
    pagination: tasksQuery.data?.pagination,
    tasks: tasksQuery.data?.data,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,

    // Create
    createTaskAsync: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.status === 'pending',

    // Update
    updateTaskAsync: updateTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.status === 'pending',

    // Delete
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.status === 'pending',

    // Single task fetcher (usage: const { data, isLoading } = getTask(id))
    getTask,
  };
}
