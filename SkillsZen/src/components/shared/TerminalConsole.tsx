import React from 'react'
import { Terminal, XCircle } from 'lucide-react'

interface TerminalConsoleProps {
  isRunning: boolean
  output: string
  onClose: () => void
}

const TerminalConsole: React.FC<TerminalConsoleProps> = ({ isRunning, output, onClose }) => {
  const getStatus = () => {
    if (isRunning) return { text: 'Executing...', color: 'text-yellow-500' }
    if (!output || output === '⚙️ Running tests...') return { text: 'Idle', color: 'text-gray-500' }
    if (output.includes('❌ FAILED')) return { text: 'Failed', color: 'text-red-500' }
    if (output.includes('✅ PASSED')) return { text: 'Success', color: 'text-green-500' }
    return { text: 'Ready', color: 'text-blue-500' }
  }

  const status = getStatus()

  return (
    <div className="h-1/3 min-h-[180px] bg-[#0c0c0c] border-t-2 border-yellow-500/40 flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.7)] z-30 animate-in slide-in-from-bottom duration-300 shrink-0">
      <div className="px-4 py-2 bg-[#141414] flex justify-between items-center border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse" />
            <Terminal size={12} className="ml-1" />
            Terminal Output
          </div>
          <div className="h-3 w-[1px] bg-white/10" />
          <div className="text-[10px] font-mono text-gray-500">
            Status: <span className={`${status.color} font-bold`}>{status.text}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white hover:bg-white/5 rounded-full p-1 transition-all"
        >
          <XCircle size={16} />
        </button>
      </div>

      <div className="flex-1 p-5 font-mono text-[13px] overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_left,_#141414_0%,_#0c0c0c_100%)] selection:bg-yellow-500/20">
        {output.split('\n').map((line, i) => (
          <div
            key={i}
            className="flex gap-4 mb-1 group border-l-2 border-transparent hover:border-white/5 px-2 transition-all"
          >
            <span className="text-gray-700 select-none w-5 text-right italic text-[11px] pt-0.5">
              {i + 1}
            </span>
            <span
              className={`whitespace-pre-wrap leading-relaxed ${
                line.includes('✅')
                  ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.2)]'
                  : line.includes('❌')
                    ? 'text-red-400 font-bold'
                    : 'text-gray-300'
              }`}
            >
              {line}
            </span>
          </div>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}

export default TerminalConsole
