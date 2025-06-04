import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category } from '@prisma/client';

export type CategoryCreateInput = Partial<Category>;
export type CategoryUpdateInput = Partial<Category>;

const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch('/api/categories');
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to fetch categories');
  return data.data;
};

const fetchCategory = async (id: string): Promise<Category> => {
  const res = await fetch(`/api/categories/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to fetch category');
  return data.data;
};

const createCategory = async (input: CategoryCreateInput): Promise<Category> => {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to create category');
  return data.data;
};

const updateCategory = async ({ id, input }: { id: string; input: CategoryUpdateInput }): Promise<Category> => {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to update category');
  return data.data;
};

const deleteCategory = async (id: string): Promise<void> => {
  const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Failed to delete category');
};

export function useCategories() {
  const queryClient = useQueryClient();

  // Fetch all categories
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Create a category
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  // Update a category
  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  // Delete a category
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  // Fetch a single category (on demand)
  const getCategory = (id: string) =>
    useQuery<Category>({
      queryKey: ['categories', id],
      queryFn: () => fetchCategory(id),
      enabled: !!id,
    });

  return {
    // List
    categories: categoriesQuery.data,
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,

    // Create
    createCategoryAsync: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.status === 'pending',

    // Update
    updateCategoryAsync: updateCategoryMutation.mutateAsync,
    isUpdating: updateCategoryMutation.status === 'pending',

    // Delete
    deleteCategoryAsync: deleteCategoryMutation.mutateAsync,
    isDeleting: deleteCategoryMutation.status === 'pending',

    // Single category fetcher (usage: const { data, isLoading } = getCategory(id))
    getCategory,
  };
}
