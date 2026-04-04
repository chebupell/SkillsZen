import React, { memo } from 'react'
import { Bot } from 'lucide-react'
import type { UserSession } from '../../../types/UserTypes'
import { BackButton } from '../backButton'

interface ChatHeaderProps {
  user: UserSession | null
  onBack: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = memo(({ user }) => {
  const firstName = (user?.name || '').split(' ')[0] || 'Guest'

  return (
    <header className="max-w-4xl mx-auto w-full mb-6 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-500">
      <BackButton label="Back to Home" />
      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 shadow-sm transition-colors hover:bg-white/80">
        <div className="text-right hidden sm:block">
          <p className="text-[11px] font-black text-slate-800 leading-none tracking-tight">
            {firstName}
          </p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <p className="text-[8px] text-green-600 uppercase tracking-widest font-bold">Online</p>
          </div>
        </div>

        <div className="relative">
          {user?.photo ? (
            <img
              src={user.photo}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform hover:scale-105"
              alt={user.name || 'User avatar'}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm ring-1 ring-slate-100">
              <Bot size={20} strokeWidth={1.5} />
            </div>
          )}
        </div>
      </div>
    </header>
  )
})

ChatHeader.displayName = 'ChatHeader'
