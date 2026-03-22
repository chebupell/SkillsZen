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
} from '../ui/alert-dialog'
import { Button } from '../ui/button'

interface DeleteAccountModalProps {
  onConfirm: () => Promise<void>
  isDeleting: boolean
}

export function DeleteAccountModal({ onConfirm, isDeleting }: DeleteAccountModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete My Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px] border-destructive/20 bg-background/95 backdrop-blur-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground pt-2">
            This action <span className="font-bold text-destructive">cannot be undone</span>. All
            your profile data will be permanently wiped from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isDeleting} variant={undefined} size={undefined}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            variant={undefined}
            size={undefined}
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
