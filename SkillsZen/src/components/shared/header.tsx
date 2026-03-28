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
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={logo} alt="SkillsZen Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-primary">
            Skills<span className="text-muted-foreground font-medium">Zen</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
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
