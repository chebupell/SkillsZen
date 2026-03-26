import React, { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface PageLayoutProps {
  children: ReactNode
  backgroundImage?: string
  className?: string
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, backgroundImage, className }) => {
  return (
    <div
      className={cn(
        'w-full flex-1 flex flex-col bg-cover bg-center bg-no-repeat bg-fixed',
        className,
      )}
      style={
        backgroundImage ? { backgroundImage: `url('/background-images/${backgroundImage}')` } : {}
      }
    >
      <div className="mx-auto max-w-7xl w-full min-w-[320px] px-4 md:px-8 py-4">{children}</div>
    </div>
  )
}

export default PageLayout
