import React, { useEffect, useState } from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage';
import type { ExerciseItem, APIBlock } from '../../../types/exerciseTypes';
import { devLogin } from '../../../api/authService';
import { apiFetch } from '../../../api/api';

const JSPage: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await devLogin();

        const blocks: APIBlock[] = await apiFetch('/api/courses/1/blocks');

        const mappedExercises: ExerciseItem[] = blocks.map((block: APIBlock) => ({
          id: block.id.toString(),
          title: block.name,
          status: block.status,
        }));

        setExercises(mappedExercises);
      } catch (error) {
        console.log('Failed to fetch exercises:', error);
      } finally {
        setLoading(false)
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="bg-white text-center p-20 text-2xl">Loading exercises...</div>;
  }

  return (
    <PageLayout backgroundImage="/background-images/js-page-background.png">
      <ExerciseSubPage
        topicImg='/icons/js-icon.png'
        topicTitle='JavaScript Exercises'
        statusText='10 random questions'
        exercisesProgress={`${exercises.filter(it => it.status === 'completed').length}/${exercises.length} blocks completed`}
        exercises={exercises}
      />
    </PageLayout>
  );
};

export default JSPage;
