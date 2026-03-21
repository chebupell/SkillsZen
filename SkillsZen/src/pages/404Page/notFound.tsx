import { MoveLeft, Home, FileSearch } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-background p-6 pt-32 sm:pt-42 font-sans bg-[url('/background-images/main-page-background.png')] bg-cover bg-center">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-[0.08] select-none pointer-events-none w-full text-center z-20">
          <span className="text-[140px] sm:text-[180px] font-black tracking-tighter leading-none">
            404
          </span>
        </div>
        <Card className="relative border-muted/40 bg-card/60 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-500">
          <CardHeader className="text-center pt-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
              <FileSearch className="h-12 w-12" />
            </div>
            <Badge
              variant="outline"
              className="w-fit mx-auto mb-3 font-mono uppercase tracking-[0.2em] text-[10px] bg-background/50"
            >
              Page Not Found
            </Badge>
            <CardTitle className="text-3xl font-bold tracking-tight">Lost in Space?</CardTitle>
          </CardHeader>
          <CardContent className="text-center px-8">
            <p className="text-muted-foreground text-sm leading-relaxed">
              The page you are looking for doesn't exist or has been moved. Check the URL or return
              to the safety of the home page.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-6 pb-10 px-8">
            <Button
              className="w-full h-11 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button
              variant="ghost"
              className="w-full h-11 text-muted-foreground hover:bg-muted/50"
              onClick={() => navigate(-1)}
            >
              <MoveLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
