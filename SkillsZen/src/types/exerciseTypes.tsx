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

export interface ExerciseItem {
  id: string;
  title: string;
  status: 'try-again' | 'in-progress' | 'completed' | 'start';
}