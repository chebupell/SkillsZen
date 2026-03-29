import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/shared/PageLayout'
import { Button } from '../../components/ui/button'
import { ExerciseCard } from './components/exerciseCard'
import type { ExerciseCardProps } from '../../types/menuTypes'
import { useAuth } from '../../services/AuthContext'
import { getAllCoursesWithProgress } from '../../services/firebase'
import { PageLoader } from '../../components/shared/PageLoader'

const Menu: React.FC = () => {
  const { user } = useAuth()
  const [cards, setCards] = useState<ExerciseCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return

    const loadData = async () => {
      try {
        const data = await getAllCoursesWithProgress(user.uid)
        setCards(data)
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
    <PageLayout
      backgroundImage="main-page-background.webp"
      className="flex flex-col items-center min-h-full"
    >
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

      <div className="flex justify-center w-full">
        <Button className="m-10 mx-auto" variant="progress">
          <Link to="/stats">View Progress</Link>
        </Button>
      </div>
    </PageLayout>
  )
}

export default Menu
