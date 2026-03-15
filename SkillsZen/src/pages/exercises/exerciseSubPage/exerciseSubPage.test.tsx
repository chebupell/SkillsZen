import { render, screen } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { ExerciseSubPage } from "./exerciseSubPage";
import type { ExerciseStatus, ExerciseSubPageProps } from '../../../types/exerciseTypes';
import { BrowserRouter } from 'react-router-dom';

describe('ExerciseSubPage', () => {
  const mockProps: ExerciseSubPageProps = {
    topicImg: '/test-img.png',
    topicTitle: 'Test Topic Title',
    statusText: 'test 5 questions',
    exercisesProgress: '1/5 completed',
    exercises: [
      { id: '1', title: 'exercise 1', status: 'completed' as ExerciseStatus}
    ],
  };

  it ('should render topic title correctly', () => {
    render(
      <BrowserRouter>
        <ExerciseSubPage {...mockProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Topic Title')).toBeInTheDocument();
  });

  it ('should render progress correctly', () => {
    render(
      <BrowserRouter>
        <ExerciseSubPage {...mockProps}/>
      </BrowserRouter>
    );

    expect(screen.getByText('1/5 completed')).toBeInTheDocument();
  })
})