import React, {useState, useEffect} from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';
import { ExerciseSubPage } from '../exerciseSubPage/exerciseSubPage';
import type { APIBlock, ExerciseItem } from '../../../types/exerciseTypes';
import { devLogin } from '../../../api/authService';
import { apiFetch } from '../../../api/api';

const AlgorithmsPage: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await devLogin();

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
  }, []);

  if (loading) {
    return <div className="bg-white text-center p-20 text-2xl">Loading exercises...</div>;
  }

  return (
    <PageLayout backgroundImage='/background-images/algo-page-background.png'>
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
