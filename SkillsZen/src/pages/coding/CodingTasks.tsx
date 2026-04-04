import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Code2 } from 'lucide-react'
import { useAuth } from '../../services/AuthContext'
import { getCodingTasksAndProgress} from '../../services/firebase'
import { PageLoader } from '../../components/shared/PageLoader'

import TaskCard from '../../components/shared/Coding/TaskCodingCard'
import TasksHeader from '../../components/shared/Coding/TasksCodingHeader'
import type { CodingTask } from '../../types/codingTasksTypes'

const CodingTasks: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState<CodingTask[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      setLoading(true)
      try {
        const { tasks: fetchedTasks } = await getCodingTasksAndProgress(user?.uid)
        if (isMounted) setTasks(fetchedTasks)
      } catch (err) {
        console.error('Error loading tasks:', err)
        if (isMounted) setError('Failed to load tasks. Please try again later.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [user?.uid])

  const completedCount = useMemo(
    () => tasks.filter((task) => user?.completedTasks?.[task.id] === 'passed').length,
    [tasks, user?.completedTasks],
  )

  const progressPercentage = useMemo(
    () => (tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0),
    [completedCount, tasks.length],
  )

  const isFullyCompleted = completedCount === tasks.length && tasks.length > 0

  if (loading) return <PageLoader />

  return (
    <div className="min-h-screen flex flex-col bg-[url('/background-images/main-page-background.webp')] bg-cover bg-center px-4 py-8">
      <div className="max-w-4xl mx-auto w-full mb-6">
        <button
          onClick={() => navigate('/')}
          className="group inline-flex items-center gap-3 text-primary/70 hover:text-primary transition-all text-xs font-bold uppercase tracking-widest active:scale-95 bg-background/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          <span>Back to Home</span>
        </button>
      </div>

      <main className="max-w-4xl mx-auto w-full">
        <div className="bg-background/50 backdrop-blur-md rounded-[2rem] border-none shadow-2xl shadow-primary/5 overflow-hidden relative p-6 md:p-10">
          <TasksHeader
            completedCount={completedCount}
            totalTasks={tasks.length}
            progressPercentage={progressPercentage}
            isFullyCompleted={isFullyCompleted}
          />
          <section className="grid gap-4 mt-10 mb-2">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskCard
                    task={task}
                    index={index}
                    status={user?.completedTasks?.[task.id]}
                    onClick={() => navigate(`editor/${task.id}`)}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-16 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20 backdrop-blur-sm">
                <div className="p-5 bg-background/80 rounded-2xl mb-4 text-primary/30 shadow-sm">
                  <Code2 size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-foreground font-bold text-lg">Challenge Awaits</h3>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mt-2">
                  New coding tasks are coming soon
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <div className="px-6 py-3 bg-destructive text-destructive-foreground rounded-full shadow-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in zoom-in slide-in-from-bottom-10">
            <span className="bg-white/20 rounded-full p-1">!</span> {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default CodingTasks
