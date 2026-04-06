import React, { useEffect, useState } from 'react'
import PageLayout from '../../../components/shared/PageLayout.tsx'
import { CourseSubPage } from '../courseSubPage/courseSubPage'
import { useAuth } from '../../../services/AuthContext'
import { getCourseSubPage } from '../../../services/firebase'
import type { CourseSubPageProps } from '../../../types/exerciseTypes'
import { PageLoader } from '../../../components/shared/PageLoader'
import { toast } from 'sonner'

interface CoursePageProps {
  courseId: string
  backgroundImage: string
}

const CoursePage: React.FC<CoursePageProps> = ({ courseId, backgroundImage }) => {
  const { user } = useAuth()
  const [data, setData] = useState<CourseSubPageProps | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return

    setLoading(true)
    const loadData = async () => {
      try {
        const result = await getCourseSubPage(courseId, user.uid)
        if (result) {
          setData(result)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Failed to fetch ${courseId} exercises: ${message}`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.uid, courseId])

  if (loading) {
    return <PageLoader />
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Course data not found.
      </div>
    )
  }

  return (
    <PageLayout backgroundImage={backgroundImage}>
      <CourseSubPage
        courseId={courseId}
        topicImg={`/icons/${data.topicImg.toLowerCase()}-icon.webp`}
        topicTitle={data.topicTitle}
        statusText={data.statusText}
        exercisesProgress={data.exercisesProgress}
        exercises={data.exercises}
      />
    </PageLayout>
  )
}

export default CoursePage
