import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Link to="/auth">Sign up</Link>
          </Button>
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </div>
      </div>
    </header>
  )
}
