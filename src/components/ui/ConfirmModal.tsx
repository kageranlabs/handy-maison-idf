import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-card border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-charcoal">{title}</h3>
            <p className="text-sm text-charcoal-muted mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 sm:px-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-charcoal bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
