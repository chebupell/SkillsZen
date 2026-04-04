import React, { memo } from 'react'
import { Trash2, ShieldAlert } from 'lucide-react'
import { Card } from '../../ui/card'
import { DeleteAccountModal } from './DeleteAccountModal'

interface DeleteProfileProps {
  onDelete: (password: string) => Promise<void>
  isDeleting: boolean
}

export const DeleteProfile: React.FC<DeleteProfileProps> = memo(({ onDelete, isDeleting }) => {
  return (
    <Card className="w-full max-w-2xl border border-destructive/20 bg-destructive/[0.02] backdrop-blur-md rounded-[2rem] mt-8 overflow-hidden transition-all hover:bg-destructive/[0.04]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 px-6">
        {/* Left Side: Icon & Info */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-destructive/10 rounded-2xl shrink-0">
            <ShieldAlert className="h-5 w-5 text-destructive animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-black text-destructive uppercase tracking-[0.15em]">
              Danger Zone
            </h4>
            <p className="text-[10px] text-slate-500 font-bold leading-tight">
              Permanently delete profile and all AI history.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <DeleteAccountModal onConfirm={onDelete} isDeleting={isDeleting} />
        </div>
      </div>

      {/* Subtle background decoration */}
      <Trash2 className="absolute -right-2 -bottom-2 h-12 w-12 text-destructive opacity-[0.03] pointer-events-none" />
    </Card>
  )
})

DeleteProfile.displayName = 'DeleteProfile'
