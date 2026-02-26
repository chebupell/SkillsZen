import React from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage';
import type { ExerciseItem } from '../../../types/exerciseTypes';

const tsExercises: ExerciseItem[] = [
  { id: '1', title: 'Subject', status: 'completed' },
  { id: '2', title: 'Subject', status: 'in-progress' },
  { id: '3', title: 'Subject', status: 'try-again' },
  { id: '4', title: 'Subject', status: 'start' },
  { id: '5', title: 'Subject', status: 'in-progress' },
]

const TSPage: React.FC = () => {
  return (
    <PageLayout backgroundImage='/background-images/ts-page-background.png'>
      <ExerciseSubPage
        topicImg='/icons/ts-icon.png'
        topicTitle='TypeScript Exercises'
        statusText='10 random questions'
        exercisesProgress={`0/10 blocks completed`}
        exercises={tsExercises}
      />
    </PageLayout>
  );
};

export default TSPage;
