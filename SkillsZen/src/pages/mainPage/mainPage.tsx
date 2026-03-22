import React, { useMemo } from 'react'
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
  const navigation = useNavigation()
  const { pathname } = useLocation()

  const isLoading = navigation.state === 'loading'

  const isOnTaskPage = useMemo(
    () => pathname.includes('/coding-tasks') || pathname.includes('/editor'),
    [pathname],
  )

  return (
    <div className="flex flex-col min-h-screen relative">
      <Toaster position="top-right" richColors theme="light" />
      {isLoading && <PageLoader />}

      <Header />

      <main className="flex-grow flex flex-col bg-[url('/background-images/main-page-background.png')] bg-cover bg-center overflow-x-hidden">
        {user && !isOnTaskPage && (
          <div className="fixed bottom-10 right-10 z-40 animate-bounce-slow">
            <button
              onClick={() => navigate('/coding-tasks')}
              aria-label="Go to Coding Tasks"
              className="group flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-black px-6 py-4 rounded-2xl shadow-[0_8px_0_0_#ca8a04] hover:shadow-[0_4px_0_0_#ca8a04] active:shadow-none active:translate-y-2 transition-all duration-200"
            >
              <Code2 size={24} />
              <span className="hidden md:inline">CODING TASKS</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainPage
