export interface CourseSubPage {
  blockName: string
  blockProgress: string
}

export interface CourseSubPageProps {
  courseId: string
  topicTitle: string
  topicImg: string
  statusText: string
  exercisesProgress: string
  exercises: ExerciseItem[]
}

export type ExerciseStatus = 'try_again' | 'in_progress' | 'completed' | 'not_started'

export interface ExerciseItem {
  id: string
  title: string
  status: ExerciseStatus
  totalQuestions: number
  currentQuestion?: number
}
