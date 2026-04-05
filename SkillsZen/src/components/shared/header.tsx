import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useAuth } from '../../services/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import logo from './../../../public/fav.png'
import { LogIn, LogOut } from 'lucide-react'

export function Header() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-[7.9vh] items-center justify-between px-4 mx-auto">
        <Link
          to="/"
          className="group flex items-center gap-3.5 hover:opacity-100 transition-all duration-500"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img
              src={logo}
              alt="SkillsZen Logo"
              className="relative h-9 w-9 object-contain drop-shadow-[0_0_8px_rgba(var(--primary),0.3)] group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black tracking-tighter text-primary flex items-center">
              Skills
              <span className="text-slate-400 font-medium tracking-normal ml-0.5 group-hover:text-primary transition-colors duration-500">
                Zen
              </span>
            </span>
            <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-1 group-hover:translate-y-0">
              Mindful Growth
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="transition-all hover:scale-105 active:scale-95">
                <Avatar className="h-8 w-8 border shadow-sm">
                  <AvatarImage src={user?.photo || ''} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                size="sm"
                onClick={handleLogout}
                className="px-5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out hover:shadow-md active:scale-95"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </div>
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <Button
                size="sm"
                asChild
                className="px-5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out hover:shadow-md active:scale-95"
              >
                <Link to="/sign-in" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="font-semibold">Sign in</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
