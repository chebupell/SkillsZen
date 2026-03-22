import React from 'react'
import type { ExerciseSubPageProps } from '../../../types/exerciseTypes'
import SuccessTag from '../tags/successTag'
import RetryTag from '../tags/retryTag'
import InProgressTag from '../tags/inProgressTag'
import StartTag from '../tags/startTag'
import BackButton from '../../../components/shared/backButton'

const STATUS_TAGS = {
  completed: <SuccessTag />,
  try_again: <RetryTag />,
  in_progress: <InProgressTag />,
  not_started: <StartTag />,
}

export const ExerciseSubPage: React.FC<ExerciseSubPageProps> = ({
  topicImg,
  topicTitle,
  exercisesProgress,
  exercises,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('lastCategory', location.pathname);
  }, [location]);

  const handleExerciseClick = async (itemId: string, status: string) => {
    if (status === 'completed' || status === 'try_again') {
      try {
        await apiFetch(`/api/blocks/${itemId}/restart`, { method: 'POST' });
      } catch (error) {
        console.error("Failed to restart block:", error);
      }
    }
    navigate(`/practice/${itemId}`);
  };

  return (
    <div className="p-4 sm:p-10 min-h-screen">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 mb-6">
        <BackButton />
        <h1 className="text-2xl sm:text-4xl text-center font-bold">{topicTitle}</h1>
        <div className="hidden sm:block w-10" />
      </div>

      <p className="text-center text-gray-500 mb-8 font-medium">{exercisesProgress}</p>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {exercises.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md hover:border-blue-100 active:scale-[0.98]"
            onClick={() => (window.location.href = `/exercise/${item.id}`)}
          >
            <div className="flex items-center gap-4">
              <img src={topicImg} alt="" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  {item.totalQuestions} questions • {item.status.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">{STATUS_TAGS[item.status] || <StartTag />}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
