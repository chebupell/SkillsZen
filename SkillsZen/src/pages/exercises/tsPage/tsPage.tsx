import React from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';

const TSPage: React.FC = () => {
  return (
    <PageLayout backgroundImage='/background-images/ts-page-background.png'>
      <div className="text-3xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex justify-center">
        TypeScript Exercises
      </div>
    </PageLayout>
  );
};

export default TSPage;
