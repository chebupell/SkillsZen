import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Code2 } from 'lucide-react'

import PageLayout from '../../components/shared/PageLayout.tsx'
import { ExerciseCard } from './components/exerciseCard'
import { PageLoader } from '../../components/shared/PageLoader.tsx'
import { ActionButton } from '../../components/shared/ActionButton' // Импортируем ActionButton

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

      <div className="flex gap-8 justify-center flex-wrap px-4 pb-24">
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
      </div>
      {user && (
        <div className="fixed right-6 bottom-6 md:right-10 md:bottom-10 flex flex-col items-end gap-3 z-40 animate-in fade-in slide-in-from-bottom-6 duration-500">
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
        </div>
      )}
    </PageLayout>
  )
}

export default Menu
