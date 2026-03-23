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

  const isMenuPage = pathname === '/'
  const isEditorMode = pathname.includes('/editor')
  const isLoading = state === 'loading'

  return (
  <div className="flex flex-col max-h-screen min-h-screen relative selection:bg-primary/10">
    <Toaster position="top-right" richColors theme="light" />
    {isLoading && <PageLoader />}
    <Header />
    <main className="grow flex flex-col bg-[url('/background-images/main-page-background.png')] bg-cover bg-center bg-fixed overflow-x-hidden relative">
      <div className="flex-grow relative">
        <Outlet />
        
        {user && isMenuPage && (
          <div className="sticky bottom-10 left-full ml-auto mr-10 w-fit z-40 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-1">
            <button
              onClick={() => navigate('/coding-tasks')}
              className="group flex items-center gap-3 bg-primary text-primary-foreground font-bold px-7 py-4 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 backdrop-blur-md"
            >
              <div className="p-2 bg-white/10 rounded-xl">
                <Code2 size={20} strokeWidth={2.5} />
              </div>
              <span className="hidden md:inline tracking-tight text-sm uppercase">Coding Tasks</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-70" />
            </button>
          </div>
        )}
      </div>
    </main>

    {!isEditorMode && <Footer />}
  </div>
)

}

export default MainPage

