import React from 'react'
import { ChevronLeft, Code2, Trash2, Layout, Loader2, Send } from 'lucide-react'

interface EditorHeaderProps {
  taskId: string | undefined
  onReset: () => void
  onViewModeToggle: () => void
  viewMode: 'split' | 'full-editor'
  onRun: () => void
  isRunning: boolean
  navigate: (path: string) => void
  status?: 'passed' | 'failed' | null
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  taskId,
  onReset,
  onViewModeToggle,
  viewMode,
  onRun,
  isRunning,
  navigate,
  status,
}) => (
  <header className="flex items-center justify-between px-6 h-14 bg-[#252526] border-b border-[#333] shrink-0 shadow-lg z-20">
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate('/coding-tasks')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] active:scale-95"
      >
        <ChevronLeft size={16} /> Tasks
      </button>
      <div className="h-4 w-[1px] bg-gray-700" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-yellow-500 text-sm font-bold">
          <Code2 size={18} className="text-yellow-600" /> {taskId || 'task'}.js
        </div>
        {status && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border animate-in fade-in zoom-in duration-300 ${
              status === 'passed'
                ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            <div
              className={`w-1 h-1 rounded-full ${status === 'passed' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
            />
            {status === 'passed' ? 'Solved' : 'Failed'}
          </div>
        )}
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={onReset}
        className="p-2 text-gray-500 hover:text-red-400 transition-colors group relative"
        title="Reset Code"
      >
        <Trash2 size={18} />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-red-500 text-white text-[9px] px-2 py-1 rounded font-bold whitespace-nowrap uppercase tracking-tighter">
          Reset All
        </span>
      </button>

      <button
        onClick={onViewModeToggle}
        className={`p-2 rounded-md transition-all ${
          viewMode === 'full-editor'
            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
            : 'text-gray-400 hover:bg-[#333]'
        }`}
        title="Toggle Layout"
      >
        <Layout size={18} />
      </button>

      <button
        onClick={onRun}
        disabled={isRunning}
        className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-xs font-black uppercase transition-all shadow-lg active:scale-95 border ${
          status === 'passed'
            ? 'bg-green-600 hover:bg-green-500 text-white border-green-400/30'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/30'
        } disabled:bg-gray-800 disabled:text-gray-500 disabled:border-transparent`}
      >
        {isRunning ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Send size={14} fill="currentColor" />
        )}
        {status === 'passed' ? 'Re-run Tests' : 'Run Tests'}
      </button>
    </div>
  </header>
)

export default EditorHeader
