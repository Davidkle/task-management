import { useQueryClient, useQuery } from '@tanstack/react-query';
import { TaskWithCategory } from '@/lib/types';

const SELECTED_TASK_KEY = ['selected-task'];

export function useSelectedTask() {
  const queryClient = useQueryClient();

  // Use useQuery to subscribe to changes, but don't run the queryFn
  const { data: selectedTask } = useQuery<TaskWithCategory | null>({
    queryKey: SELECTED_TASK_KEY,
    queryFn: () => null, // dummy, won't run
    enabled: false, // disables the queryFn
    initialData: null, // optional: what to show if nothing is set yet
  });

  // Set the currently selected task
  const setSelectedTask = (task: TaskWithCategory | null) => {
    queryClient.setQueryData(SELECTED_TASK_KEY, task);
  };

  return { selectedTask, setSelectedTask };
}
