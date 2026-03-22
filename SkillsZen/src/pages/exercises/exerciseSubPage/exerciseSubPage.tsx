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

const STATUS_TAGS = {
  completed: <SuccessTag />,
  try_again: <RetryTag />,
  in_progress: <InProgressTag />,
  not_started: <StartTag />,
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
      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-6">
        <div className="flex justify-start">
            <BackButton />
        </div>
        <div className="text-2xl sm:text-4xl text-center">{topicTitle}</div>
        <div className="hidden sm:block w-25" aria-hidden="true"></div>
      </div>

      <p className="text-center text-gray-600 mb-8">{exercisesProgress} completed blocks</p>

      <div className="grid gap-4 md:grid-cols-1 cursor-pointer">
        {exercises.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-xl shadow-lg md:flex items-center gap-8 hover:bg-gray-100"
            onClick={() => handleExerciseClick(item.id, item.status)}
          >
            <div className="flex items-center gap-4 mb-1">
              <img src={topicImg} alt="" className="max-h-10 rounded-lg" />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.totalQuestions} questions
                </p>
              </div>
            </div>
            <div className="ml-auto">{STATUS_TAGS[item.status] || <StartTag />}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
