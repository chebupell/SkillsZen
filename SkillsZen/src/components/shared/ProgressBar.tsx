import React from 'react'

interface ProgressBarProps {
  progress: number
  isCompleted?: boolean
  showStats?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isCompleted = false,
  showStats = true,
  size = 'md',
}) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className="w-full space-y-2">
      <div className={`w-full ${heights[size]} bg-gray-100 rounded-full overflow-hidden relative`}>
        <div
          className={`h-full transition-all duration-1000 ease-out rounded-full shadow-sm ${
            isCompleted
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
              : 'bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.2)]'
          }`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </div>
      {showStats && (
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest leading-none">
          <span className={isCompleted ? 'text-yellow-600' : 'text-indigo-600'}>
            {Math.round(progress)}% Mastery
          </span>
          {isCompleted && (
            <span className="text-green-500 animate-pulse flex items-center gap-1">
              Perfect Score ✨
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProgressBar
