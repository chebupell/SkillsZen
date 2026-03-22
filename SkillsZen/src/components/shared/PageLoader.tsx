import { Loader2, Sparkles } from 'lucide-react'

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-md z-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/30 rounded-full blur-[120px] animate-pulse" />
      <div className="relative flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center border border-white/50 overflow-hidden">
            <img
              src="/background-images/main-page-background.png"
              alt="Loading..."
              className="w-full h-full object-cover rounded-xl scale-125 animate-float"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-xl shadow-lg border-2 border-white animate-bounce-slow">
            <Sparkles className="text-white h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
            <span className="text-xl font-black text-gray-800 tracking-tight uppercase italic">
              Loading Tasks
            </span>
          </div>
          <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 animate-progress-loading" />
          </div>
        </div>
      </div>
      <p className="absolute bottom-10 text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">
        SkillsZen Engine
      </p>
    </div>
  )
}
