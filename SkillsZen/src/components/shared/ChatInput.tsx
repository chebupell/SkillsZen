import React from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../../services/AuthContext'

interface ChatInputProps {
  input: string
  setInput: (val: string) => void
  onSend: () => void
  disabled: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSend, disabled }) => {
  const { user } = useAuth()
  return (
    <div className="p-6 bg-slate-50/50 border-t border-slate-100">
      <div className="relative max-w-3xl mx-auto flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder={`Type a message ${user?.name}`}
          disabled={disabled}
          className="flex-1 bg-white border border-slate-200 rounded-2xl py-4 px-6 text-slate-800 focus:outline-none focus:border-primary transition-all shadow-sm disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || disabled}
          className="p-4 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
