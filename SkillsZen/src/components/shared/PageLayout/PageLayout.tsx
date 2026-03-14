import React, { type ReactNode } from 'react';
import { cn } from '../../../lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, backgroundImage, className }) => {
  return (
    <div
      className={cn("min-h-[92vh] w-full bg-cover bg-center bg-no-repeat bg-fixed", className)}
      style={backgroundImage ? { backgroundImage: `url('/background-images/${backgroundImage}')` } : {}}
    >
      <div className="mx-auto max-w-7xl w-full min-w-[320px] p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
