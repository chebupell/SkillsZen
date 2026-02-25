import React from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';

const AlgorithmsPage: React.FC = () => {
  return (
    <PageLayout backgroundImage='/background-images/algo-page-background.png'>
      <div className="text-3xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex justify-center">
        Algorithms Exercises
      </div>
    </PageLayout>
  );
};

export default AlgorithmsPage;
