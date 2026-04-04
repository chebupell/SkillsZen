import React, { useMemo } from 'react'
import { Outlet, useNavigation, useLocation } from 'react-router-dom'

import { Header } from '../../components/shared/header'
import { Footer } from '../../components/shared/footer'
import { Toaster } from '../../components/ui/sonner'
import { PageLoader } from '../../components/shared/PageLoader'
import { cn } from '../../lib/utils'

const MainPage: React.FC = () => {
  const { state } = useNavigation()
  const { pathname } = useLocation()

  const { isAuthPage, isAiChatPage, isLoading } = useMemo(() => {
    const authPaths = ['/sign-in', '/sign-up']
    return {
      isAuthPage: authPaths.includes(pathname),
      isAiChatPage: pathname === '/ai-chat',
      isLoading: state === 'loading',
    }
  }, [pathname, state])

  return (
    <div
      className={cn(
        'flex flex-col selection:bg-primary/10 transition-colors duration-300',
        isAiChatPage ? 'h-screen overflow-hidden' : 'min-h-screen',
      )}
    >
      <Toaster position="top-right" richColors theme="light" closeButton />

      {isLoading && <PageLoader />}

      <Header />

      <main
        className={cn(
          'flex-1 flex flex-col relative bg-white bg-cover bg-center transition-all',
          isAiChatPage ? 'overflow-hidden min-h-0' : 'overflow-y-auto',
        )}
        style={{
          backgroundImage: "url('/background-images/main-page-background.webp')",
          backgroundAttachment: 'fixed',
        }}
      >
        <div className={cn('flex-1 flex flex-col w-full relative', isAiChatPage && 'min-h-0')}>
          <Outlet />
        </div>
      </main>
      {isAuthPage && <Footer />}
    </div>
  )
}

export default MainPage
