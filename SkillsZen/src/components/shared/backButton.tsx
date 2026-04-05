import React, { memo } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

interface BackButtonProps {
  label?: string
  className?: string
}

export const BackButton: React.FC<BackButtonProps> = memo(({ label = 'Back', className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    const path = location.pathname
    const lastCategory = localStorage.getItem('lastCategory') || '/'

    // List of pages that should always redirect to Home
    const forceHomePages = ['/coding', '/ai-chat']
    const isForceHomePage = forceHomePages.some((page) => path.includes(page))

    if (isForceHomePage || path === lastCategory) {
      navigate('/')
    } else {
      navigate(lastCategory)
    }
  }

  return (
    <Button
      variant="back"
      onClick={handleBack}
      className={`group inline-flex items-center gap-3 text-slate-500 hover:text-primary transition-all text-[10px] font-bold uppercase tracking-widest active:scale-95 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md ${className}`}
    >
      <ChevronLeft
        size={14}
        strokeWidth={3}
        className="transition-transform group-hover:-translate-x-1"
      />
      <span>{label}</span>
    </Button>
  )
})

BackButton.displayName = 'BackButton'
