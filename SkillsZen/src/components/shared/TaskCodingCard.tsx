import React from 'react'
import { CheckCircle, Circle, Trophy, ArrowRight, Code2, AlertCircle } from 'lucide-react'

interface TaskCardProps {
  task: {
    id: string
    name: string
  }
  index: number
  status: 'passed' | 'failed' | null | undefined
  onClick: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, status, onClick }) => {
  const isPassed = status === 'passed'
  const isFailed = status === 'failed'

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md
        ${
          isPassed
            ? 'border-green-500/30 bg-green-500/10 shadow-lg shadow-green-500/5' 
            : isFailed
              ? 'border-red-500/30 bg-red-500/10 shadow-lg shadow-red-500/5'
              : 'border-white/20 bg-background/40 hover:bg-background/60 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1'
        }`}
    >
      <div className="flex items-center gap-5 relative z-10">
        <div
          className={`transition-all duration-500 ${
            isPassed
              ? 'text-green-500 scale-110'
              : isFailed
                ? 'text-red-500'
                : 'text-muted-foreground/30 group-hover:text-primary'
          }`}
        >
          {isPassed ? (
            <CheckCircle size={32} strokeWidth={2.2} />
          ) : isFailed ? (
            <AlertCircle size={32} strokeWidth={2.2} />
          ) : (
            <Circle size={32} strokeWidth={2.2} />
          )}
        </div>

        <div>
          <h3 className={`font-bold text-lg tracking-tight transition-colors ${
            isPassed ? 'text-green-900/90' : isFailed ? 'text-red-900/90' : 'text-foreground'
          }`}>
            {task.name}
          </h3>
          
          <div className="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest">
            <span className={`px-2 py-0.5 rounded-md ${
              isPassed ? 'bg-green-500/20 text-green-700' : isFailed ? 'bg-red-500/20 text-red-700' : 'bg-primary/10 text-primary'
            }`}>
              Step #{index + 1}
            </span>
            
            <span className="text-muted-foreground/30">|</span>
            
            {isPassed ? (
              <span className="text-green-600 flex items-center gap-1">
                <Trophy size={10} /> Completed
              </span>
            ) : isFailed ? (
              <span className="text-red-500 font-black">Try Again</span>
            ) : (
              <span className="text-muted-foreground group-hover:text-primary transition-colors">
                Available
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg active:scale-90
            ${
              isPassed
                ? 'bg-green-500 text-white shadow-green-500/20'
                : isFailed
                  ? 'bg-red-500 text-white shadow-red-500/20 animate-pulse'
                  : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground shadow-primary/5'
            }`}
        >
          {isPassed ? <CheckCircle size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />}
        </div>
      </div>

      <div className={`absolute -right-4 -bottom-4 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12 ${
        isPassed ? 'text-green-500' : isFailed ? 'text-red-500' : 'text-primary'
      }`}>
        <Code2 size={100} />
      </div>
    </div>
  )
}


export default TaskCard
