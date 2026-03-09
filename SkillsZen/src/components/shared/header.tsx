import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useAuth } from '../../services/AuthContext'

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  const navigate = useNavigate(); 

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-end">
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm">
                <Link to="/signup">Sign up</Link>
              </Button>
              <Button variant="ghost" size="sm">
                <Link to="/signin">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
