export interface Answer {
  id: number | string
  text: string
}

export interface Task {
  id: number | string
  text: string
  question_type: string
  answers: Answer[]
  correct_answer: string
  explanation: string
}

export interface BlockProgress {
  block_id: string
  block_name: string
  course_name: string
  status: string
  current_question: number
  total_questions: number
  correct_count: number
}

export interface ProgressOut {
  total_courses: number
  completed_blocks: number
  total_blocks: number
  correct_answers: number
  total_answered: number
  blocks: BlockProgress[]
}

export interface PracticePageProps extends BlockProgress {
  userId: string
  question?: Task
  onNext?: () => void
}
