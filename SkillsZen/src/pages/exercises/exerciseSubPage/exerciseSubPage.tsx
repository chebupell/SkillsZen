import React from 'react'
import type { ExerciseSubPageProps } from '../../../types/exerciseTypes'
import SuccessTag from '../tags/successTag'
import RetryTag from '../tags/retryTag'
import InProgressTag from '../tags/inProgressTag'
import StartTag from '../tags/startTag'
import BackButton from '../../../components/shared/backButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { practiceService } from '../../../services/practiceService'
import { useAuth } from '../../../services/AuthContext'

const getStatusTag = (status: string, currentQuestion?: number, totalQuestions?: number) => {
  switch (status) {
    case 'completed':
      return <SuccessTag />
    case 'try_again':
      return <RetryTag />
    case 'in_progress':
      return <InProgressTag current={currentQuestion} total={totalQuestions} />
    case 'not_started':
    default:
      return <StartTag />
  }
}

export const ExerciseSubPage: React.FC<ExerciseSubPageProps> = ({
  courseId,
  topicImg,
  topicTitle,
  exercisesProgress,
  exercises,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('lastCategory', location.pathname);
  }, [location]);

  const handleExerciseClick = async (itemId: string, status: string) => {
    if (status === 'completed' || status === 'try_again') {
      try {
        if (user?.uid) {
          await practiceService.restartBlock(user.uid, itemId, courseId);
        }
      } catch (error) {
        console.error("Failed to restart block:", error);
      }
    }
    navigate(`/practice/${itemId}`);
  };

  return (
    <div className="p-4 sm:p-10 min-h-screen">
      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-3">
        <div className="flex justify-start">
          <BackButton />
        </div>
        <div className="text-2xl sm:text-4xl text-right sm:text-center">{topicTitle}</div>
        <div className="hidden sm:block w-25" aria-hidden="true"></div>
      </div>

      <p className="text-right sm:text-center text-gray-600 mb-4">{exercisesProgress} completed blocks</p>

      <div className="grid gap-4 md:grid-cols-1 cursor-pointer">
        {exercises.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-8 hover:bg-gray-100"
            onClick={() => handleExerciseClick(item.id, item.status)}
          >
            <div className="flex flex-row items-center justify-center md:justify-start gap-4 w-full md:w-auto">
              <img src={topicImg} alt="" className="max-h-10 rounded-lg" />
              <div className="text-left">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.totalQuestions} questions
                </p>
              </div>
            </div>
            <div className="mt-2 md:mt-0 md:ml-auto">{getStatusTag(item.status, item.currentQuestion, item.totalQuestions)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
