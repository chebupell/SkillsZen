import React, { useState } from 'react'
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog'
import { Button } from '../../ui/button'

import { Input } from '../../ui/input'
import { Label } from '../../ui/label'

interface DeleteAccountModalProps {
  onConfirm: (password: string) => Promise<void>
  isDeleting: boolean
}

export function DeleteAccountModal({ onConfirm, isDeleting }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('')

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!password) return
    await onConfirm(password)
    setPassword('') // Clear after attempt
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="rounded-xl px-6 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-destructive/20 transition-all active:scale-95"
        >
          Delete Profile
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-[400px] rounded-[2.5rem] border-destructive/20 bg-background/95 backdrop-blur-xl p-8">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle size={28} className="animate-pulse" />
          </div>

          <div className="space-y-2 text-center">
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-slate-800">
              Confirm Identity
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium text-sm leading-relaxed">
              For security reasons, please enter your{' '}
              <span className="font-bold text-destructive">password</span> to permanently delete
              your profile.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <div className="my-6 space-y-2">
          <Label
            htmlFor="confirm-password"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
          >
            Account Password
          </Label>
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-11 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition-all"
              autoComplete="current-password"
            />
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-col gap-3">
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting || !password}
            className="w-full h-12 rounded-2xl bg-destructive text-white font-black uppercase tracking-widest text-[10px] hover:bg-destructive/90 shadow-lg shadow-destructive/20 active:scale-95 transition-all"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Deletion'}
          </AlertDialogAction>

          <AlertDialogCancel
            disabled={isDeleting}
            className="w-full h-12 rounded-2xl border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50"
            onClick={() => setPassword('')}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
