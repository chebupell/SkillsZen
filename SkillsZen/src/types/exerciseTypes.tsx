export interface ExerciseSubPage {
  blockName: string;
  blockProgress: string;
}

export interface ExerciseSubPageProps {
  topicTitle: string;
  topicImg: string;
  statusText: string;
  exercisesProgress: string;
  exercises: ExerciseItem[];
}

export type ExerciseStatus = 'try_again' | 'in_progress' | 'completed' | 'not_started';

export interface ExerciseItem {
  id: string;
  title: string;
  status: ExerciseStatus;
}

export interface APIBlock {
  id: number;
  name: string;
  status: ExerciseStatus;
}