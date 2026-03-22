import React from 'react'
import { CheckCircle, Circle, Trophy, ArrowRight, Code2 } from 'lucide-react'

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
      className={`group relative flex items-center justify-between p-6 bg-white rounded-[2rem] border transition-all duration-300 cursor-pointer overflow-hidden
        ${
          isPassed
            ? 'border-green-100 bg-green-50/20 shadow-sm'
            : isFailed
              ? 'border-red-100 bg-red-50/10'
              : 'border-white hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 shadow-sm'
        }`}
    >
      <div className="flex items-center gap-6 relative z-10">
        <div
          className={`transition-all duration-500 ${
            isPassed
              ? 'text-green-500 scale-110'
              : isFailed
                ? 'text-red-400'
                : 'text-gray-200 group-hover:text-indigo-400'
          }`}
        >
          {isPassed ? (
            <CheckCircle size={36} strokeWidth={2.5} />
          ) : (
            <Circle size={36} strokeWidth={2.5} />
          )}
        </div>

        <div>
          <h3 className="font-black text-gray-800 text-xl tracking-tight leading-tight group-hover:text-indigo-900 transition-colors">
            {task.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold uppercase tracking-wider">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
              Step #{index + 1}
            </span>
            <span className="text-gray-300">|</span>
            {isPassed ? (
              <span className="text-green-600 flex items-center gap-1">
                <Trophy size={10} /> Completed
              </span>
            ) : isFailed ? (
              <span className="text-red-400">Try Again</span>
            ) : (
              <span className="text-gray-400 group-hover:text-indigo-500 font-black">
                Available
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <button
          className={`w-12 h-12 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg active:scale-90
            ${
              isPassed
                ? 'bg-green-500 text-white shadow-green-100'
                : isFailed
                  ? 'bg-red-500 text-white shadow-red-100 animate-pulse'
                  : 'bg-white text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white shadow-gray-100'
            }`}
        >
          {isPassed ? <CheckCircle size={22} /> : <ArrowRight size={22} />}
        </button>
      </div>
      {!isPassed && !isFailed && (
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Code2 size={120} />
        </div>
      )}
    </div>
  )
}

export default TaskCard
