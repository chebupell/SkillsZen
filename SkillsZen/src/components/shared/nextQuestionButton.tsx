import React from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface ContinueButtonProps {
  onClick?: () => void
  disabled?: boolean
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick, disabled }) => {
  const navigate = useNavigate()
  return (
    <Button
      disabled={disabled}
      style={
        disabled
          ? {
              cursor:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='9'/><line x1='5.5' y1='18.5' x2='18.5' y2='5.5'/></svg>\") 12 12, not-allowed",
            }
          : {}
      }
      className="group flex justify-self-center bg-blue-500 text-white transition-all duration-200 gap-2 rounded-xl shadow-lg border-none m-4 hover:bg-blue-600 hover:scale-[1.02] active:bg-blue-700 active:scale-100 active:shadow-inner disabled:pointer-events-auto disabled:opacity-100 disabled:hover:scale-100"
      onClick={() => (onClick ? onClick() : navigate(+1))}
    >
      <span>Next Question</span>
      <span className="group-hover:translate-x-1 transition-transform duration-200">
        <ArrowRight size={20} />
      </span>
    </Button>
  )
}

export default ContinueButton
