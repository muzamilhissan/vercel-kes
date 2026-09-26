import { useSyncExternalStore } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const DISMISS_AFTER_MS = 4000;

let toasts: Toast[] = [];
const listeners = new Set<() => void>();

function emit(next: Toast[]) {
  toasts = next;
  listeners.forEach((listener) => listener());
}

/**
 * Toasts live outside React so mutation callbacks and the API layer can raise one
 * without needing to be inside a provider.
 */
export const toast = {
  show(message: string, type: ToastType = 'info') {
    const id = crypto.randomUUID();
    emit([...toasts, { id, message, type }]);
    setTimeout(() => toast.dismiss(id), DISMISS_AFTER_MS);
    return id;
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
  warning: (message: string) => toast.show(message, 'warning'),
  info: (message: string) => toast.show(message, 'info'),
  dismiss(id: string) {
    emit(toasts.filter((item) => item.id !== id));
  },
};

export function useToasts(): Toast[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => toasts,
  );
}
