import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  isDestructive = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 overflow-hidden transition-all text-slate-800"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-lg shrink-0 ${isDestructive ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 text-xs font-medium text-white rounded-lg transition-colors cursor-pointer ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#0F2038] hover:bg-[#1E3A60]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
