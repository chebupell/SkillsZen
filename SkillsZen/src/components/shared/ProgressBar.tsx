import React from 'react'
import type { ProgressBarProps } from '../../types/codingTasksTypes'

interface InProgressTagProps {
  current?: number
  total?: number
}

export const ProgressBar: React.FC<InProgressTagProps> = ({ current = 0, total = 0 }) => {
  const widthPercentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="flex justify-self-center gap-2 min-w-2xs bg-blue-200 h-1 rounded-full m-4 overflow-hidden">
      <div
        className="bg-blue-600 h-full rounded-full transition-all duration-300"
        style={{ width: `${widthPercentage}%` }}
      ></div>
    </div>
  )
}

const ProgressBarCoding: React.FC<ProgressBarProps> = ({
  progress,
  isCompleted = false,
  showStats = true,
  size = 'md',
}) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  return (
    <div className="w-full space-y-3">
      <div
        className={`w-full ${heights[size]} bg-primary/5 rounded-full overflow-hidden relative border border-primary/10 backdrop-blur-sm`}
      >
        <div
          className={`h-full transition-all duration-1000 ease-out rounded-full relative z-10 ${
            isCompleted
              ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
              : 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]'
          }`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>
      </div>

      {showStats && (
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.15em] leading-none">
          <span className={isCompleted ? 'text-yellow-600' : 'text-primary'}>
            {Math.round(progress)}% Mastery
          </span>
          {isCompleted && (
            <span className="text-green-500 flex items-center gap-1.5">
              <span className="h-1 w-1 bg-green-500 rounded-full animate-ping" />
              Perfect Score
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProgressBarCoding
