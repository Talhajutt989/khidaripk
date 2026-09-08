'use client';

import React from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle, MessageCircle } from 'lucide-react';

const TOAST_ICONS = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  error: <AlertCircle className="w-4 h-4 text-red-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  info: <Info className="w-4 h-4 text-sky-500" />,
  whatsapp: <MessageCircle className="w-4 h-4 text-green-500" />,
};

const TOAST_STYLES = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info: 'border-sky-200 bg-sky-50',
  whatsapp: 'border-green-200 bg-green-50',
};

export function ToastContainer() {
  const { notifications, removeToast } = useMarketplaceStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-lg animate-fade-in-up ${TOAST_STYLES[toast.type]}`}
        >
          <div className="shrink-0 mt-0.5">{TOAST_ICONS[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800">{toast.title}</p>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
