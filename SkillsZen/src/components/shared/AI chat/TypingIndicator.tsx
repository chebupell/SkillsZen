import { Loader2 } from 'lucide-react'

export const TypingIndicator: React.FC = () => (
  <div className="flex gap-4 animate-in fade-in duration-300">
    <div className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-primary border border-slate-200 shadow-sm">
      <Loader2 size={18} className="animate-spin" />
    </div>
    <div className="bg-white border border-slate-100 px-5 py-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5 shadow-sm">
      {[0, 0.2, 0.4].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  </div>
)
