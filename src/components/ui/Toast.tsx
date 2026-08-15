import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0 && message) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, message]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border ${isError ? 'bg-white border-red-100' : 'bg-charcoal border-charcoal/20'}`}>
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <p className={`text-sm font-medium pr-2 ${isError ? 'text-charcoal' : 'text-white'}`}>{message}</p>
        <button onClick={onClose} className={`p-1.5 -mr-2 rounded-lg transition-colors ${isError ? 'text-gray-400 hover:text-charcoal hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
