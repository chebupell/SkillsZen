import React from 'react'
import { Code2, Trophy } from 'lucide-react'
import ProgressBar from './ProgressBar'

interface TasksHeaderProps {
  completedCount: number
  totalTasks: number
  progressPercentage: number
  isFullyCompleted: boolean
}

const TasksHeader: React.FC<TasksHeaderProps> = ({
  completedCount,
  totalTasks,
  progressPercentage,
  isFullyCompleted,
}) => {
  return (
    <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div className="space-y-4 text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-3 text-primary font-bold uppercase tracking-[0.2em] text-[11px]">
          <div className="p-2 bg-primary/10 rounded-xl backdrop-blur-md border border-primary/20">
            <Code2 size={16} />
          </div>
          <span>Learning Path</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tighter leading-none">
          JavaScript{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-primary/50">
            Tasks
          </span>
        </h1>
      </div>
      <div className="bg-background/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-2xl shadow-primary/5 min-w-[320px] transition-all duration-500">
        <div className="flex items-center gap-5 mb-5">
          <div
            className={`p-4 rounded-2xl transition-all duration-700 flex items-center justify-center ${
              isFullyCompleted 
                ? 'bg-yellow-500 text-white shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-110' 
                : 'bg-primary/10 text-primary/40 border border-primary/10'
            }`}
          >
            <Trophy size={28} className={isFullyCompleted ? 'animate-bounce' : ''} />
          </div>
          
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
              Your Progress
            </div>
            <div className="text-2xl font-bold text-foreground flex items-baseline gap-1">
              {completedCount} 
              <span className="text-muted-foreground/30 text-lg font-medium">/</span> 
              <span className="text-muted-foreground/60 text-lg font-semibold">{totalTasks}</span>
            </div>
          </div>
        </div>
        <div className="relative pt-2">
          <ProgressBar progress={progressPercentage} isCompleted={isFullyCompleted} />
          
          {isFullyCompleted && (
            <div className="absolute -top-1 right-0 text-[10px] font-black text-yellow-600 uppercase tracking-widest animate-pulse">
              Mastered!
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TasksHeader

