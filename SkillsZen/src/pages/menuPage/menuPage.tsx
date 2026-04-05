import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Code2, Layers } from 'lucide-react'

import PageLayout from '../../components/shared/PageLayout.tsx'
import { ExerciseCard } from './components/exerciseCard'
import { PageLoader } from '../../components/shared/PageLoader.tsx'
import { ActionButton } from '../../components/shared/ActionButton'

import { useAuth } from '../../services/AuthContext'
import { getAllCoursesWithProgress } from '../../services/firebase'
import type { ExerciseCardProps } from '../../types/menuTypes'
import { toast } from 'sonner'

interface MenuProps {
  backgroundImage: string
}

const Menu: React.FC<MenuProps> = ({ backgroundImage }) => {
  const { user } = useAuth()
  const [cards, setCards] = useState<ExerciseCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.uid) return

    const loadData = async () => {
      try {
        const data = await getAllCoursesWithProgress(user.uid)
        setCards(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Failed to fetch exercises: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.uid])

  if (loading) return <PageLoader />

  return (
    <PageLayout backgroundImage={backgroundImage}>
      <h2 className="text-center mb-12 flex flex-col items-center gap-2">
        <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-800">
          Welcome, <span className="text-primary">{user?.name?.split(' ')[0] || 'Guest'}</span>!
        </span>
      </h2>
      <div className="flex gap-8 justify-center flex-wrap px-4">
        {cards.length > 0 ? (
          cards.map((card) => (
            <ExerciseCard
              key={card.id}
              id={card.id}
              name={card.name}
              icon={`${card.icon.toLowerCase()}-icon.webp`}
              description={card.description}
              progress={`${card.completed_blocks}/${card.total_blocks} blocks completed`}
              route={card.icon.toLocaleLowerCase()}
            />
          ))
        ) : (
          <div className="text-center p-20 text-slate-400">No courses available.</div>
        )}
        <div className="md:right-10 md:bottom-10 flex items-end gap-15 z-40 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <ActionButton
            label="AI Chat"
            icon={<Sparkles size={20} />}
            onClick={() => navigate('/ai-chat')}
            variant="indigo"
          />
          <ActionButton
            label="Coding Tasks"
            icon={<Code2 size={20} />}
            onClick={() => navigate('/coding-tasks')}
            variant="primary"
          />
          <div className="[&>button]:bg-[#3178C6] [&>button]:text-white [&>button]:border-none [&>button]:shadow-lg [&>button]:shadow-blue-500/40">
            <ActionButton
              label="TS Cards"
              icon={<Layers size={20} strokeWidth={2.5} />}
              onClick={() => navigate('/ts-cards')}
              variant="primary"
            />
          </div>
        </div>
      </div>


      <div className="mt-6 mb-4 flex flex-col items-center text-center space-y-8 animate-in fade-in duration-1000 delay-500">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="max-w-2xl space-y-4">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            The Path to <span className="text-primary">Mastery</span>
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
            "True growth is a quiet dialogue with your own potential. Complexity is simply layers of
            simplicity that haven't been unraveled yet. Take your time. Breathe. Clarity comes to
            the <span className="text-primary font-bold not-italic">focused mind</span>."
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-primary/20" />
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/30">
            SkillsZen • Consistency Over Intensity
          </span>
        </div>
      </div>
    </PageLayout>
  )
}

export default Menu
