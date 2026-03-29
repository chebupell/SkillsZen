import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/shared/PageLayout.tsx'
import { ExerciseCard } from './components/exerciseCard'
import type { ExerciseCardProps } from '../../types/menuTypes'
import { useAuth } from '../../services/AuthContext'
import { getAllCoursesWithProgress } from '../../services/firebase'
import { PageLoader } from '../../components/shared/PageLoader.tsx'

interface MenuProps {
  backgroundImage: string
}

const Menu: React.FC<MenuProps> = ({ backgroundImage }) => {
  const { user } = useAuth()
  const [cards, setCards] = useState<ExerciseCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return

    const loadData = async () => {
      try {
        const data = await getAllCoursesWithProgress(user.uid)
        setCards(data)
        console.log(data)
      } catch (error) {
        console.log('Failed to fetch exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.uid])

  if (loading) {
    return <PageLoader />
  }

  if (cards.length === 0) {
    return <div className="text-center p-20">No courses available.</div>
  }

  return (
    <PageLayout backgroundImage={backgroundImage}>
      <h2 className="text-center text-4xl text-secondary-foreground mb-10">
        Welcome, {user?.name || 'Guest'}!
      </h2>

      <div className="flex gap-8 justify-center flex-wrap px-4">
        {cards.map((card) => (
          <ExerciseCard
            key={card.id}
            id={card.id}
            name={card.name}
            icon={`${card.icon.toLowerCase()}-icon.webp`}
            description={card.description}
            progress={`${card.completed_blocks}/${card.total_blocks} blocks completed`}
            route={card.icon.toLocaleLowerCase()}
          />
        ))}
      </div>
    </PageLayout>
  )
}

export default Menu
