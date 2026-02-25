import React from 'react';
import PageLayout from '../../../shared/components/PageLayout/PageLayout';

const JSPage: React.FC = () => {
  return (
    <PageLayout backgroundImage="/background-images/js-page-background.png">
      <div className="text-3xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex justify-center">
        JS Exercises
      </div>
    </PageLayout>
  );
};

export default JSPage;
