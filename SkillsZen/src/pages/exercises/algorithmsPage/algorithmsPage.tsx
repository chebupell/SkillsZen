import React, { useState, useEffect } from 'react'
import PageLayout from '../../../components/shared/PageLayout/PageLayout'
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage'
import { useAuth } from '../../../services/AuthContext'
import { getExerciseSubPage } from '../../../services/login'
import type { ExerciseSubPageProps } from '../../../types/exerciseTypes'

const AlgorithmsPage: React.FC = () => {
  const { user } = useAuth()
  const [data, setData] = useState<ExerciseSubPageProps | null>(null)
  const [loading, setLoading] = useState(true)

  const COURSE_ID = 'algo_course'

  useEffect(() => {
    if (!user?.uid) return

    const loadData = async () => {
      try {
        const result = await getExerciseSubPage(COURSE_ID, user.uid)
        if (result) setData(result)
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.uid])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl animate-pulse">
        Loading...
      </div>
    )
  if (!data) return <div className="text-center p-20">Course content is missing.</div>

  return (
    <PageLayout backgroundImage="algo-page-background.png">
      <ExerciseSubPage
        courseId={COURSE_ID}
        topicImg={`/icons/${data.topicImg.toLowerCase()}-icon.png`}
        topicTitle={data.topicTitle}
        statusText={data.statusText}
        exercisesProgress={data.exercisesProgress}
        exercises={data.exercises}
      />
    </PageLayout>
  )
}

export default AlgorithmsPage
