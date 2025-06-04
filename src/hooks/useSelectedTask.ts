import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Task } from '@/app/app/data-table/schema';

const SELECTED_TASK_KEY = ['selected-task'];

export function useSelectedTask() {
  const queryClient = useQueryClient();

  // Get the currently selected task
  const { data: selectedTask } = useQuery<Task | null>({
    queryKey: SELECTED_TASK_KEY,
    queryFn: () => null,
  });

  // Set the currently selected task
  const setSelectedTask = (task: Task | null) => {
    queryClient.setQueryData(SELECTED_TASK_KEY, task);
  };

  return { selectedTask, setSelectedTask };
}
