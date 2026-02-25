import React from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';

const JSPage: React.FC = () => {
  return (
    <PageLayout backgroundImage="/background-images/js-page-background.png">
      <h1 className="text-3xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        JS Exercises
      </h1>
    </PageLayout>
  );
};

export default JSPage;
