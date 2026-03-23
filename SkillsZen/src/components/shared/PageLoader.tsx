import { Loader2, Sparkles } from 'lucide-react'

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-xl z-[9999]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="relative flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-700 ease-out">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative w-28 h-28 md:w-32 md:h-32 bg-background/80 backdrop-blur-sm rounded-[2rem] p-1 shadow-2xl flex items-center justify-center border border-white/40 overflow-hidden">
            <img
              src="/fav.png"
              alt="Loading..."
              className="w-16 h-16 object-contain animate-pulse"
            />
          </div>
          <div className="absolute -top-2 -right-2 bg-primary p-2 rounded-xl shadow-lg border-2 border-background animate-bounce text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-xl font-bold text-foreground tracking-tight">
              Preparing <span className="text-primary">Skills</span>Zen
            </span>
          </div>
          <div className="h-1.5 w-32 bg-primary/10 rounded-full overflow-hidden border border-primary/5">
            <div className="h-full bg-primary rounded-full animate-progress-loading shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
          </div>
        </div>
      </div>
      <p className="absolute bottom-12 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.4em]">
        Elevating Your Potential
      </p>
    </div>
  )
}
