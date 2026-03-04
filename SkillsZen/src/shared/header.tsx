import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-end">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Link to="/auth">Sign up</Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Link to="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
