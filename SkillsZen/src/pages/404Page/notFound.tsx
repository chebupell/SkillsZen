import { MoveLeft, Home, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-8 font-sans">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <Card className="relative z-10 border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-700 rounded-[2.5rem] ring-1 ring-black/5 overflow-hidden">
            <CardHeader className="text-center pt-12 pb-4">
              {/* 404 is now the MAIN element inside the card */}
              <div className="relative mb-6">
                <span className="text-[100px] sm:text-[130px] font-black tracking-tighter leading-none bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent drop-shadow-sm">
                  404
                </span>
                <div className="absolute -top-2 -right-4 p-2 bg-primary rounded-full text-primary-foreground shadow-lg shadow-primary/30 animate-bounce">
                  <Sparkles size={20} fill="currentColor" />
                </div>
              </div>

              <Badge
                variant="outline"
                className="w-fit mx-auto mb-4 font-mono uppercase tracking-[0.2em] text-[10px] bg-primary/5 border-primary/20 text-primary font-bold px-4 py-1 rounded-full"
              >
                System Error: Page Not Found
              </Badge>

              <CardTitle className="text-3xl font-black tracking-tight text-slate-800">
                Lost in Space?
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center px-10">
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                The page you are looking for has been moved or doesn't exist. Let's get you back on
                track.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-8 pb-12 px-10">
              {/* Button styled like Sign In - light background, solid on hover */}
              <Button
                onClick={() => navigate('/')}
                className="w-full h-12 px-5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out hover:shadow-md active:scale-95 font-bold uppercase tracking-widest text-[10px]"
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Back to Home</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="w-full h-12 px-5 rounded-full text-slate-400 hover:bg-slate-100/80 transition-all duration-300 ease-in-out active:scale-95 font-bold uppercase tracking-widest text-[10px]"
              >
                <MoveLeft className="mr-2 h-4 w-4" />
                <span>Go Back</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
