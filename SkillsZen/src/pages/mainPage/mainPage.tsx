import React, { useMemo } from 'react'
import { Outlet, useNavigate, useNavigation, useLocation } from 'react-router-dom'
import { Sparkles, Code2 } from 'lucide-react'

import { Header } from '../../components/shared/header'
import { Footer } from '../../components/shared/footer'
import { Toaster } from '../../components/ui/sonner'
import { PageLoader } from '../../components/shared/PageLoader'
import { useAuth } from '../../services/AuthContext'
import { cn } from '../../lib/utils'
import { ActionButton } from '../../components/shared/ActionButton'

const MainPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { state } = useNavigation()
  const { pathname } = useLocation()

  const { isAuthPage, isMenuPage, isAiChatPage, isLoading } = useMemo(
    () => ({
      isAuthPage: pathname === '/sign-in' || pathname === '/sign-up',
      isMenuPage: pathname === '/',
      isAiChatPage: pathname === '/ai-chat',
      isLoading: state === 'loading',
    }),
    [pathname, state],
  )

  return (
    <div
      className={cn(
        'flex flex-col selection:bg-primary/10',
        isAiChatPage ? 'h-screen overflow-hidden' : 'min-h-screen',
      )}
    >
      <Toaster position="top-right" richColors theme="light" />
      {isLoading && <PageLoader />}

      <Header />

      <main
        className={cn(
          'flex-1 flex flex-col relative bg-white bg-cover bg-center',
          isAiChatPage ? 'overflow-hidden min-h-0' : 'overflow-y-auto',
        )}
        style={{ backgroundImage: "url('/background-images/main-page-background.webp')" }}
      >
        <div className={cn('flex-1 flex flex-col w-full relative', isAiChatPage && 'min-h-0')}>
          <Outlet />

          {/* Плавающие кнопки действий */}
          {user && (isMenuPage || isAiChatPage) && (
            <div className="fixed right-6 bottom-6 md:right-10 md:bottom-10 flex flex-col items-end gap-3 z-40 animate-in fade-in slide-in-from-bottom-6 duration-500">
              {!isAiChatPage && (
                <ActionButton
                  label="AI Chat"
                  icon={<Sparkles size={20} />}
                  onClick={() => navigate('/ai-chat')}
                  variant="indigo"
                />
              )}

              {isMenuPage && (
                <ActionButton
                  label="Coding Tasks"
                  icon={<Code2 size={20} />}
                  onClick={() => navigate('/coding-tasks')}
                  variant="primary"
                />
              )}
            </div>
          )}
        </div>
      </main>
      {isAuthPage && <Footer />}
    </div>
  )
}

export default MainPage
