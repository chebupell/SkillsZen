import React, { useEffect, useState } from 'react'
import PageLayout from '../../../components/shared/PageLayout/PageLayout'
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage'
import { useAuth } from '../../../services/AuthContext'
import { getExerciseSubPage } from '../../../services/firebase'
import type { ExerciseSubPageProps } from '../../../types/exerciseTypes'
import { PageLoader } from '../../../components/shared/PageLoader'

const JSPage: React.FC = () => {
  const { user } = useAuth()
  const [data, setData] = useState<ExerciseSubPageProps | null>(null)
  const [loading, setLoading] = useState(true)

  const COURSE_ID = 'js_course'

  useEffect(() => {
    if (!user?.uid) return

    const loadData = async () => {
      try {
        const result = await getExerciseSubPage(COURSE_ID, user.uid)
        if (result) {
          setData(result)
        }
      } catch (error) {
        console.error('Failed to fetch JavaScript exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.uid])

  if (loading) return <PageLoader />

  if (!data) {
    return <div className="text-center p-20 text-xl">Course not found.</div>
  }

  return (
    <PageLayout backgroundImage="js-page-background.png">
      <ExerciseSubPage
        topicImg={`/icons/${data.topicImg.toLowerCase()}-icon.png`}
        topicTitle={data.topicTitle}
        statusText={data.statusText}
        exercisesProgress={data.exercisesProgress}
        exercises={data.exercises}
      />
    </PageLayout>
  )
}

export default JSPage
