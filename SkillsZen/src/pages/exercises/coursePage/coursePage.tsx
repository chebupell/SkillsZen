import React, { useEffect, useState } from 'react'
import PageLayout from '../../../components/shared/PageLayout'
import { CourseSubPage } from '../courseSubPage/courseSubPage'
import { useAuth } from '../../../services/AuthContext'
import { getCourseSubPage } from '../../../services/firebase'
import type { CourseSubPageProps } from '../../../types/exerciseTypes'
import { PageLoader } from '../../../components/shared/PageLoader'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface CoursePageProps {
  courseId: string
  backgroundImage: string
}

const CoursePage: React.FC<CoursePageProps> = ({ courseId, backgroundImage }) => {
  const { user } = useAuth()
  const [data, setData] = useState<CourseSubPageProps | null>(null)
  const [loading, setLoading] = useState(true)
  const { pathname } = useLocation()
  const isTsPage = pathname === '/ts'
  const navigate = useNavigate()

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
        console.error(`Failed to fetch ${courseId} exercises:`, error)
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
        topicImg={`/icons/${data.topicImg.toLowerCase()}-icon.png`}
        topicTitle={data.topicTitle}
        statusText={data.statusText}
        exercisesProgress={data.exercisesProgress}
        exercises={data.exercises}
      />

      {isTsPage && (
        <div className="flex justify-center w-full ml-auto animate-in fade-in slide-in-from-bottom-6 duration-500 pb-1">
          <button
            onClick={() => navigate('/ts-cards')}
            className="group flex items-center gap-3 bg-primary text-primary-foreground font-bold px-7 py-4 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 backdrop-blur-md"
          >
            <span className="md:inline tracking-tight text-sm uppercase">
              TS Cards
            </span>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform opacity-70"
            />
          </button>
        </div>
      )}
    </PageLayout>
  )
}

export default CoursePage
