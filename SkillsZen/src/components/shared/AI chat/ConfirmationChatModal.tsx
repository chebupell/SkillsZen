import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationChatModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export const ConfirmationChatModal: React.FC<ConfirmationChatModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
            >
              Clear All
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
