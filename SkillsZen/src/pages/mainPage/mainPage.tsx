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

  const { isAuthPage, isAiChatPage, isLoading } = useMemo(
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
        </div>
      </main>
      {isAuthPage && <Footer />}
    </div>
  )
}

export default MainPage
