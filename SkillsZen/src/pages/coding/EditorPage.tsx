import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTaskData, runCodeInBrowser } from '../../services/firebase'
import { PageLoader } from '../../components/shared/PageLoader'
import Editor from '@monaco-editor/react'
import type { TaskData } from '../../types/UserTypes'
import TestResultsModal from '../../components/shared/TestResultsModal'
import ResetConfirmModal from '../../components/shared/ResetConfirmModal'
import EditorHeader from '../../components/shared/EditorHeader'
import TaskDescription from '../../components/shared/TaskDescription'
import TerminalConsole from '../../components/shared/TerminalConsole'
import { useAuth } from '../../services/AuthContext'

const EditorPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { user, updateTaskStatus } = useAuth()

  const [task, setTask] = useState<TaskData | null>(null)
  const [userCode, setUserCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'split' | 'full-editor'>('split')

  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [testSummary, setTestSummary] = useState<{ passed: number; failed: number }>({
    passed: 0,
    failed: 0,
  })

  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const parseResults = (text: string) => {
    const passed = (text.match(/✅ PASSED/g) || []).length
    const failed = (text.match(/❌ FAILED/g) || []).length
    return { passed, failed }
  }

  useEffect(() => {
    let isMounted = true
    const loadTask = async () => {
      if (!taskId) return
      try {
        const data = await getTaskData(taskId)
        if (isMounted && data) {
          const taskData = data as TaskData
          setTask(taskData)

          const savedDraft = localStorage.getItem(`draft_${taskId}`)
          setUserCode(savedDraft || taskData.initial_code || '')
        }
      } catch (err) {
        console.error('Failed to load task:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadTask()
    return () => {
      isMounted = false
    }
  }, [taskId])

  useEffect(() => {
    if (taskId && userCode) {
      localStorage.setItem(`draft_${taskId}`, userCode)
    }
  }, [userCode, taskId])

  const handleRunTests = async () => {
    if (!task || !userCode) return

    setIsRunning(true)
    setShowTerminal(true)
    setOutput('⚙️ Running tests...')

    try {
      const testContent = Array.isArray(task.tests) ? task.tests[0] : task.tests
      const result = await runCodeInBrowser(userCode, testContent || '')
      const summary = parseResults(result.output)
      setOutput(result.output)
      setTestSummary(summary)
      setIsModalOpen(true)

      const status = summary.failed === 0 && summary.passed > 0 ? 'passed' : 'failed'
      if (taskId) {
        await updateTaskStatus(taskId, status)
      }
    } catch (error) {
      console.error('Test Execution Error:', error)
      setOutput('🔥 Critical Sandbox Error.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleResetConfirm = () => {
    if (task) {
      setUserCode(task.initial_code)
    }
  }

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

      <main className="flex flex-1 w-full overflow-hidden min-h-0">
        {viewMode === 'split' && <TaskDescription text={task?.text} />}
        <section
          className={`${viewMode === 'split' ? 'w-[60%]' : 'w-full'} h-full flex flex-col bg-[#1e1e1e] relative overflow-hidden`}
        >
          <div className="px-6 py-2 bg-[#1e1e1e] text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-[#333] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]" />
              <span>JavaScript v18</span>
            </div>
            <span className="text-gray-600 font-mono italic">
              Lines: {userCode.split('\n').length}
            </span>
          </div>
          <div className="flex-1 w-full min-h-0 relative">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={userCode}
              onChange={(value) => setUserCode(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 20 },
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
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
