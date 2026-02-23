export interface ExerciseSubPage {
  blockName: string;
  blockProgress: string;
}

export interface ExerciseSubPageProps {
  topicTitle: string;
  exercisesProgress: string;
  exercises: ExerciseItem[];
}

export interface ExerciseItem {
  id: string;
  title: string;
  status: 'Try again' | 'In-progress' | 'Completed';
}