export interface Answer {
  id: number;
  text: string;
}

export interface Task {
  id: number;
  text: string;
  question_type: string;
  answers: Answer[];
}

export interface BlockProgress {
  block_id: number;
  block_name: string;
  course_name: string;
  status: string;
  current_question: number;
  total_questions: number;
  correct_count: number;
}

export interface ProgressOut {
  total_courses: number;
  completed_blocks: number;
  total_blocks: number;
  correct_answers: number;
  total_answered: number;
  blocks: BlockProgress[];
}

export interface PracticePageProps extends BlockProgress {
  question?: Task;
}