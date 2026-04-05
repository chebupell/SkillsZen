import React from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../../../services/AuthContext'

interface ChatInputProps {
  input: string
  setInput: (val: string) => void
  onSend: () => void
  disabled: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSend, disabled }) => {
  const { user } = useAuth()

  return (
    <div className="p-3 sm:p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 sticky bottom-0">
      <div className="relative max-w-3xl mx-auto flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && input.trim() && onSend()}
          placeholder={`Type a message ${user?.name?.split(' ')[0] || 'Zen'}`}
          disabled={disabled}
          className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl py-2.5 px-4 sm:py-4 sm:px-6 text-sm sm:text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-primary text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 shadow-lg transition-all"
        >
          <Send
            size={18}
            className="flex-shrink-0"
          />
        </button>
      </div>
    </div>
  )
}
