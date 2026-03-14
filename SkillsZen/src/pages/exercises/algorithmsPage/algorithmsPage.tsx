import React, { useState, useEffect } from 'react';
import PageLayout from '../../../components/shared/PageLayout/PageLayout';
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage';
import type { APIBlock, ExerciseItem } from '../../../types/exerciseTypes';
import { apiFetch } from '../../../api/api';
import { auth } from '../../../services/login';
import { onAuthStateChanged } from 'firebase/auth';

const AlgorithmsPage: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const loadData = async () => {
          try {
            const blocks: APIBlock[] = await apiFetch('/api/courses/3/blocks');

            const mappedExercises: ExerciseItem[] = blocks.map((block: APIBlock) => ({
              id: block.id.toString(),
              title: block.name,
              status: block.status,
            }));

            setExercises(mappedExercises);
          } catch (error) {
            console.log('Failed to fetch exercises: ', error)
          } finally {
            setLoading(false);
          }
        }
        loadData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="bg-white text-center p-20 text-2xl">Loading exercises...</div>;
  }

  return (
    <PageLayout backgroundImage='/algo-page-background.png'>
      <ExerciseSubPage
        topicImg='/icons/algo-icon.png'
        topicTitle='Algorithms Exercises'
        statusText='10 questions'
        exercisesProgress={`${exercises.filter((it) => it.status === 'completed').length}/${exercises.length} blocks completed`}
        exercises={exercises}
      />
    </PageLayout>
  );
};

export default AlgorithmsPage;
