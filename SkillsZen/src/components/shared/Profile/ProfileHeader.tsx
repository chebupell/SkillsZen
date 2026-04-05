import { memo } from 'react'
import { User, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { CardDescription, CardHeader, CardTitle } from '../../ui/card'

interface ProfileHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    photo?: string | null
  } | null
  previewPhoto?: string | null
}

export const ProfileHeader = memo(({ user, previewPhoto }: ProfileHeaderProps) => {
  const isNewPhoto = !!previewPhoto

  return (
    <CardHeader className="relative flex flex-col sm:flex-row items-center gap-6 pb-10 pt-12 px-8 border-b border-slate-100 bg-gradient-to-b from-primary/[0.05] to-transparent overflow-hidden rounded-t-[2.5rem]">
      <Sparkles className="absolute right-8 top-8 h-12 w-12 text-primary opacity-[0.04] pointer-events-none" />

      <div className="relative shrink-0">
        <Avatar className="h-24 w-24 border-4 border-white shadow-2xl transition-transform hover:scale-105 duration-500">
          <AvatarImage src={user?.photo || ''} className="object-cover" />
          <AvatarFallback className="...">{(user?.name?.[0] || 'U').toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center sm:items-start space-y-2 text-center sm:text-left z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">
              Account Settings
            </p>
            {isNewPhoto && (
              <span className="bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 tracking-tight leading-none">
            {user?.name || 'Guest'}
          </CardTitle>
        </div>

        <CardDescription className="flex items-center gap-2 px-4 py-1.5 bg-white/70 border border-slate-100 rounded-full text-slate-500 font-bold text-[11px] shadow-sm backdrop-blur-md transition-colors hover:bg-white/90">
          <User size={12} className="text-slate-400" />
          {user?.email}
        </CardDescription>
      </div>
    </CardHeader>
  )
})

ProfileHeader.displayName = 'ProfileHeader'
