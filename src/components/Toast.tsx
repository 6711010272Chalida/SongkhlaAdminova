import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = toast.type === 'success' 
          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          : toast.type === 'error'
          ? <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          : <Info className="w-4 h-4 text-sky-500 shrink-0" />;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-white text-slate-800 rounded-lg shadow-lg border border-slate-200 text-xs font-medium animate-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
