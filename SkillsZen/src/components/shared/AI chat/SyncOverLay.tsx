import { Loader2 } from 'lucide-react'

export const SyncOverlay = () => (
  <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="animate-spin text-primary" size={32} />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing...</span>
    </div>
  </div>
)
