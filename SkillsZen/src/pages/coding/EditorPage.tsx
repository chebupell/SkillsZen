import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { getCodingTasksAndProgress, getTaskData, runCodeInBrowser } from '../../services/firebase'
import { PageLoader } from '../../components/shared/PageLoader'
import { useAuth } from '../../services/AuthContext'

import TestResultsModal from '../../components/shared/Coding/TestResultsModal'
import ResetConfirmModal from '../../components/shared/Coding/ResetConfirmModal'
import EditorHeader from '../../components/shared/EditorHeader'
import TaskDescription from '../../components/shared/Coding/TaskDescription'
import TerminalConsole from '../../components/shared/Coding/TerminalConsole'
import type { CodingTask, TaskData } from '../../types/codingTasksTypes'
import { toast } from 'sonner'

const EditorPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { user, updateTaskStatus, setDraftLocal, saveDraftToCloud, resetDraft } = useAuth()

  const [task, setTask] = useState<TaskData | null>(null)
  const [allTasks, setAllTasks] = useState<CodingTask[]>([])
  const [userCode, setUserCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'split' | 'full-editor'>('split')

  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [testSummary, setTestSummary] = useState({ passed: 0, failed: 0 })

  const latestCodeRef = useRef(userCode)
  useEffect(() => {
    latestCodeRef.current = userCode
  }, [userCode])

  useEffect(() => {
    let isMounted = true
    const initPage = async () => {
      if (!taskId) return
      try {
        setLoading(true)

        const [taskResponse, tasksAndProgress] = await Promise.all([
          getTaskData(taskId),
          getCodingTasksAndProgress(user?.uid),
        ])

        if (!isMounted) return

        if (tasksAndProgress.tasks) {
          setAllTasks(tasksAndProgress.tasks)
        }

        if (taskResponse) {
          const t = taskResponse as TaskData
          setTask(t)

          const existingDraft = user?.drafts?.[taskId]
          const initialCode = existingDraft || t.initial_code || ''
          setUserCode(initialCode)
          latestCodeRef.current = initialCode
        }
      } catch {
        toast.error('Failed to initialize page data. Please try again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initPage()
    return () => {
      isMounted = false
    }
  }, [taskId, user?.uid])

  useEffect(() => {
    if (!taskId || loading || !userCode) return

    if (userCode === user?.drafts?.[taskId]) return

    setDraftLocal(taskId, userCode)

    const timeoutId = setTimeout(() => {
      saveDraftToCloud(taskId, userCode)
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
      if (latestCodeRef.current && taskId) {
        saveDraftToCloud(taskId, latestCodeRef.current)
      }
    }
  }, [userCode, taskId, setDraftLocal, saveDraftToCloud, loading])

  const handleRunTests = async () => {
    if (!task || !userCode || !taskId) return

    setIsRunning(true)
    setShowTerminal(true)
    setOutput('⚙️ Running tests...')

    try {
      const testContent = Array.isArray(task.tests) ? task.tests[0] : task.tests
      const result = await runCodeInBrowser(userCode, testContent || '')

      const passed = (result.output.match(/✅ PASSED/g) || []).length
      const failed = (result.output.match(/❌ FAILED/g) || []).length

      setOutput(result.output)
      setTestSummary({ passed, failed })
      setIsModalOpen(true)

      const status = failed === 0 && passed > 0 ? 'passed' : 'failed'
      await updateTaskStatus(taskId, status)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Execution Error: ${errorMessage}`)
      setOutput('🔥 Sandbox Error. Check your syntax or connection.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleResetConfirm = async () => {
    if (!taskId || !task) return

    const initialCode = task.initial_code || ''

    setUserCode(initialCode)
    latestCodeRef.current = initialCode

    await resetDraft(taskId)

    setIsResetModalOpen(false)
  }

  const nextTaskId = useMemo(() => {
    if (!allTasks.length || !taskId) return null

    const currentIndex = allTasks.findIndex((t) => t.id === taskId)
    if (currentIndex !== -1 && currentIndex < allTasks.length - 1) {
      return allTasks[currentIndex + 1].id
    }
    const firstUnsolved = allTasks.find((t) => {
      const status = user?.completedTasks?.[t.id]
      return status !== 'passed'
    })

    return firstUnsolved ? firstUnsolved.id : null
  }, [allTasks, taskId, user?.completedTasks])

  if (loading) return <PageLoader />

  return (
    <div className="fixed inset-0 flex flex-col h-screen w-screen bg-[#1e1e1e] text-white z-[9999] overflow-hidden">
      <EditorHeader
        taskId={taskId}
        onReset={() => setIsResetModalOpen(true)}
        onViewModeToggle={() => setViewMode((v) => (v === 'split' ? 'full-editor' : 'split'))}
        viewMode={viewMode}
        onRun={handleRunTests}
        isRunning={isRunning}
        navigate={navigate}
        status={taskId ? user?.completedTasks?.[taskId] : null}
      />

      <main className="flex-1 flex w-full overflow-hidden min-h-0">
        {viewMode === 'split' && <TaskDescription text={task?.text} />}

        <section
          className={`${viewMode === 'split' ? 'w-[60%]' : 'w-full'} flex flex-col bg-[#1e1e1e] border-l border-[#333] relative overflow-hidden`}
        >
          <div className="px-6 py-2 bg-[#1e1e1e] text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-[#333] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span>JavaScript Environment</span>
            </div>
            <span className="font-mono italic opacity-50">
              Lines: {userCode.split('\n').length}
            </span>
          </div>

          <div className="flex-1 w-full min-h-0 relative">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={userCode}
              onChange={(val) => setUserCode(val || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', monospace",
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
              }}
            />
          </div>

          {showTerminal && (
            <TerminalConsole
              isRunning={isRunning}
              output={output}
              onClose={() => setShowTerminal(false)}
            />
          )}
        </section>
      </main>
      <TestResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        summary={testSummary}
        fullOutput={output}
        nextTaskId={nextTaskId}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
      />
    </div>
  )
}

export default EditorPage
