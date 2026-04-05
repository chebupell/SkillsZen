import { Bot } from 'lucide-react'

export const EmptyChat: React.FC<{ name?: string }> = ({ name }) => (
  <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
    <Bot size={64} strokeWidth={1} className="mb-4" />
    <p className="text-xs uppercase tracking-widest font-bold text-center leading-relaxed">
      Welcome, {name?.split(' ')[0]}!<br />
      Ask me anything about code or tasks.
    </p>
  </div>
)
