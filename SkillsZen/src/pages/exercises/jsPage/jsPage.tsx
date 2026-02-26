import React from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage';
import type { ExerciseItem } from '../../../types/exerciseTypes';

const jsExercises: ExerciseItem[] = [
  { id: '1', title: 'Subject', status: 'Completed' },
  { id: '2', title: 'Subject', status: 'In-progress' },
  { id: '3', title: 'Subject', status: 'Try again' },
  { id: '4', title: 'Subject', status: 'Completed' },
  { id: '5', title: 'Subject', status: 'In-progress' },
];

const JSPage: React.FC = () => {
  return (
    <PageLayout backgroundImage="/background-images/js-page-background.png">
      <ExerciseSubPage
        topicImg='/icons/js-icon.png'
        topicTitle='JavaScript Exercises'
        statusText='10 random questions'
        exercisesProgress={`0/10 blocks completed`}
        exercises={jsExercises}
      />
    </PageLayout>
  );
};

export default JSPage;
