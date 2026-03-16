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
        <ExerciseSubPage {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('1/5 completed')).toBeInTheDocument();
  });

  it('should render status tags correctly', () => {
    const statusProps: ExerciseSubPageProps = {
      ...mockProps,
      exercises: [
        { id: '1', title: 'Exercise 1', status: 'completed' },
        { id: '2', title: 'Exercise 2', status: 'try_again' },
        { id: '3', title: 'Exercise 3', status: 'in_progress' },
        { id: '4', title: 'Exercise 4', status: 'start' as ExerciseStatus },
      ],
    };

    render(
      <BrowserRouter>
        <ExerciseSubPage {...statusProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Not Started')).toBeInTheDocument();
  });
})