import React from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage';
import type { ExerciseItem } from '../../../types/exerciseTypes';

const algoExercises: ExerciseItem[] = [
  { id: '1', title: 'Subject', status: 'completed' },
  { id: '2', title: 'Subject', status: 'start' },
  { id: '3', title: 'Subject', status: 'try-again' },
  { id: '4', title: 'Subject', status: 'completed' },
  { id: '5', title: 'Subject', status: 'in-progress' },
]

const AlgorithmsPage: React.FC = () => {
  return (
    <PageLayout backgroundImage='/background-images/algo-page-background.png'>
      <ExerciseSubPage
        topicImg='/icons/algo-icon.png'
        topicTitle='Algorithms Exercises'
        statusText='10 random questions'
        exercisesProgress={`0/10 blocks completed`}
        exercises={algoExercises}
      />
    </PageLayout>
  );
};

export default AlgorithmsPage;
