import React from "react";
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage';
import type { ExerciseItem } from '../../../types/exerciseTypes';

const algoExercises: ExerciseItem[] = [
  { id: '1', title: 'Subject', status: 'Completed' },
  { id: '2', title: 'Subject', status: 'In-progress' },
  { id: '3', title: 'Subject', status: 'Try again' },
];

const JSPage: React.FC = () => {
  return (
    <ExerciseSubPage
      topicTitle="JS"
      exercisesProgress={`1/3 blocks completed`}
      exercises={algoExercises}
    />
  );
};

export default JSPage;