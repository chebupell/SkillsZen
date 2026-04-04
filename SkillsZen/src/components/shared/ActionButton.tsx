import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ActionButtonProps {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant: 'indigo' | 'primary'
}

export const ActionButton: React.FC<ActionButtonProps> = ({ label, icon, onClick, variant }) => {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700',
    primary: 'bg-primary shadow-primary/20 hover:opacity-90',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 text-white font-bold px-7 py-4 rounded-2xl shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95',
        themes[variant],
      )}
    >
      <div className="p-2 bg-white/10 rounded-xl">{icon}</div>
      <span className="hidden md:inline tracking-tight text-sm uppercase">{label}</span>
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-70" />
    </button>
  )
}
