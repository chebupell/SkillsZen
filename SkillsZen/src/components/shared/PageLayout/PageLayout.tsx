import React, { type ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, backgroundImage }) => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : {}}
    >
      <div className="mx-auto max-w-[1280px] w-full min-w-[320px] p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
