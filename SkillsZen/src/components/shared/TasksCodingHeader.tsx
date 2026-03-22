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
    <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-6">
      <div className="space-y-2 text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <Code2 size={14} />
          </div>
          Learning Path
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
          JavaScript{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
            Tasks
          </span>
        </h1>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 min-w-[300px] space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl transition-all duration-500 ${isFullyCompleted ? 'bg-yellow-400 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
          >
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Progress
            </div>
            <div className="text-xl font-black text-gray-900">
              {completedCount} <span className="text-gray-300">/</span> {totalTasks}
            </div>
          </div>
        </div>
        <ProgressBar progress={progressPercentage} isCompleted={isFullyCompleted} />
      </div>
    </header>
  )
}

export default TasksHeader
