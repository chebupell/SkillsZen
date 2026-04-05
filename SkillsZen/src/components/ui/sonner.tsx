import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group-[.toaster]:text-lg group-[.toaster]:p-6 group-[.toaster]:rounded-2xl group-[.toaster]:shadow-2xl',
          title: 'group-[.toast]:font-bold',
          description: 'group-[.toast]:text-base',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-6 text-green-500" />,
        info: <InfoIcon className="size-6 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-6 text-yellow-500" />,
        error: <OctagonXIcon className="size-6 text-destructive" />,
        loading: <Loader2Icon className="size-6 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          '--width': '420px',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
