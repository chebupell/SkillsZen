import { ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TestResultsModal = ({
  isOpen,
  onClose,
  summary,
  fullOutput,
  nextTaskId,
}: {
  isOpen: boolean
  onClose: () => void
  summary: { passed: number; failed: number }
  fullOutput: string
  nextTaskId?: string | null
}) => {
  const navigate = useNavigate()
  if (!isOpen) return null

  const isAllPassed = summary.failed === 0 && summary.passed > 0

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#252526] border border-[#333] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div
          className={`p-6 flex items-center justify-between border-b border-[#333] ${isAllPassed ? 'bg-green-500/10' : 'bg-red-500/10'}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${isAllPassed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
            >
              {isAllPassed ? <CheckCircle size={24} /> : <XCircle size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">
                {isAllPassed ? 'All Tests Passed!' : 'Tests Failed'}
              </h2>
              <p className="text-xs font-bold opacity-60 uppercase">
                {summary.passed} Passed • {summary.failed} Failed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm custom-scrollbar bg-[#1e1e1e]">
          <pre className="whitespace-pre-wrap leading-relaxed text-gray-300">{fullOutput}</pre>
        </div>
        <div className="p-4 bg-[#252526] border-t border-[#333] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-bold bg-[#333] hover:bg-[#444] transition-all"
          >
            Close
          </button>
          {isAllPassed && (
            <button
              onClick={() => {
                if (nextTaskId) {
                  // Если есть следующая или нерешенная задача — идем к ней
                  navigate(`/coding-tasks/editor/${nextTaskId}`)
                } else {
                  // Если абсолютно всё пройдено — в общее меню
                  navigate('/coding-tasks')
                }
                onClose() // Обязательно закрываем модалку перед переходом
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95 transition-all group"
            >
              {/* Динамический текст в зависимости от наличия следующей задачи */}
              <span>{nextTaskId ? 'Next Task' : 'All Completed! Menu'}</span>

              {/* Иконка стрелки с анимацией при наведении (group-hover) */}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestResultsModal
