import { toast } from 'sonner';

export type ToastType = 'loading' | 'error' | 'success';

type ShowToastOptions = {
  id: string;
  message: string;
  type: ToastType;
  dismissible?: boolean;
  closeButton?: boolean;
};

export function showToast({ id, message, type, dismissible = true, closeButton = true }: ShowToastOptions) {
  const configs = { id, dismissible, closeButton };
  switch (type) {
    case 'loading':
      toast.loading(message, configs);
      break;
    case 'error':
      toast.error(message, configs);
      break;
    case 'success':
      toast.success(message, configs);
      break;
    default:
      toast(message, configs);
  }
}

export function dismissToast(id: string) {
  toast.dismiss(id);
}
