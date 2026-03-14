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

export interface PracticePageProps {
  block_id: number;
  block_name: string;
  course_name: string;
  status: string;
  current_question: number;
  total_questions: number;
  correct_count: number;
  question?: Task;
}