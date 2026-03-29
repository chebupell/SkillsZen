import { Header } from '../../components/shared/header'
import { Outlet, useNavigate, useNavigation, useLocation } from 'react-router-dom'
import { Toaster } from '../../components/ui/sonner'
import { Footer } from '../../components/shared/footer'
import { Code2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../services/AuthContext'
import { PageLoader } from '../../components/shared/PageLoader'

const MainPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { state } = useNavigation()
  const { pathname } = useLocation()

  const isLoginPage = pathname === '/sign-in'
  const isSignUpPage = pathname === '/sign-up'
  const isMenuPage = pathname === '/'
  const isLoading = state === 'loading'

  return (
    <div className="flex flex-col h-screen overflow-hidden selection:bg-primary/10">
      <Toaster position="top-right" richColors theme="light" />
      {isLoading && <PageLoader />}
      <Header />
      <main className="flex-1 overflow-y-auto bg-white bg-cover bg-center relative">
        <div className="flex flex-col min-h-full">
          <Outlet />

          {user && isMenuPage && (
            <div className="fixed right-6 bottom-6 md:right-10 md:bottom-10 w-fit z-40 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <button
                onClick={() => navigate('/coding-tasks')}
                className="group flex items-center gap-3 bg-primary text-primary-foreground font-bold px-7 py-4 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 backdrop-blur-md"
              >
                <div className="p-2 bg-white/10 rounded-xl">
                  <Code2 size={20} strokeWidth={2.5} />
                </div>
                <span className="hidden md:inline tracking-tight text-sm uppercase">
                  Coding Tasks
                </span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform opacity-70"
                />
              </button>
            </div>
          )}
        </div>
      </main>

      {isLoginPage || isSignUpPage ? <Footer /> : null}
    </div>
  )
}

export default MainPage
