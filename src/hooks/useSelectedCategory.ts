import { useQueryClient, useQuery } from '@tanstack/react-query';
import type { Category } from '@prisma/client';

const SELECTED_CATEGORY_KEY = ['selected-category'];

export function useSelectedCategory() {
  const queryClient = useQueryClient();

  // Get the currently selected category
  const { data: selectedCategory } = useQuery<Category | null>({
    queryKey: SELECTED_CATEGORY_KEY,
    queryFn: () => null,
  });

  // Set the currently selected category
  const setSelectedCategory = (category: Category | null) => {
    queryClient.setQueryData(SELECTED_CATEGORY_KEY, category);
  };

  return { selectedCategory, setSelectedCategory };
}
