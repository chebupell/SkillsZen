import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Code2 } from 'lucide-react'
import { useAuth } from '../../services/AuthContext'
import { getCodingTasksAndProgress, type CodingTask } from '../../services/firebase'
import { PageLoader } from '../../components/shared/PageLoader'
import TasksHeader from '../../components/shared/TasksCodingHeader'
import TaskCard from '../../components/shared/TaskCodingCard'

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
    <div className="min-h-screen bg-[#f8fafc] pb-20 selection:bg-indigo-100">
      <nav className="sticky top-0 z-30 bg-[#f8fafc]/80 backdrop-blur-md transition-all">
        <div className="max-w-4xl mx-auto pt-8 pb-4 px-6">
          <button
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all text-[10px] font-black uppercase tracking-[0.2em] active:scale-95"
          >
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:shadow-indigo-500/10 transition-all">
              <ChevronLeft size={14} strokeWidth={3} />
            </div>
            <span>Back to Home</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">
        <div className="mt-4 md:p-10 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden relative">
          <TasksHeader
            completedCount={completedCount}
            totalTasks={tasks.length}
            progressPercentage={progressPercentage}
            isFullyCompleted={isFullyCompleted}
          />
          <section className="grid gap-5 mt-12 mb-6">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"
                  style={{ animationDelay: `${index * 80}ms` }}
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
              <div className="flex flex-col items-center justify-center p-16 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 shadow-inner">
                <div className="p-5 bg-white rounded-2xl mb-4 text-slate-300 shadow-sm">
                  <Code2 size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-slate-900 font-black text-lg tracking-tight">
                  Challenge Awaits
                </h3>
                <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.2em] mt-2">
                  New coding tasks are on their way
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest animate-in zoom-in slide-in-from-bottom-10">
            <span className="text-red-400 mr-2 font-bold">!</span> {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default CodingTasks
