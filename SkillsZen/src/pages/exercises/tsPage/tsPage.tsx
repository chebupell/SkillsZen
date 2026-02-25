import React from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage';
import type { ExerciseItem } from '../../../types/exerciseTypes';

const tsExercises: ExerciseItem[] = [
  { id: '1', title: 'Subject', status: 'Completed' },
  { id: '2', title: 'Subject', status: 'In-progress' },
  { id: '3', title: 'Subject', status: 'Try again' },
  { id: '4', title: 'Subject', status: 'Completed' },
  { id: '5', title: 'Subject', status: 'In-progress' },
  { id: '6', title: 'Subject', status: 'Try again' },
  { id: '7', title: 'Subject', status: 'Completed' },
  { id: '8', title: 'Subject', status: 'In-progress' },
  { id: '9', title: 'Subject', status: 'Try again' },
  { id: '10', title: 'Subject', status: 'Try again' },
]

const TSPage: React.FC = () => {
  return (
    <PageLayout backgroundImage='/background-images/ts-page-background.png'>
      <ExerciseSubPage
        topicImg='/icons/ts-icon.png'
        topicTitle='TypeScript Exercises'
        exercisesProgress={`1/3 blocks completed`}
        exercises={tsExercises}
      />
    </PageLayout>
  );
};

export default TSPage;
