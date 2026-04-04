import { Header } from '../../components/shared/header'
import { Outlet, useNavigation, useLocation } from 'react-router-dom'
import { Toaster } from '../../components/ui/sonner'
import { Footer } from '../../components/shared/footer'
import { PageLoader } from '../../components/shared/PageLoader'

const MainPage: React.FC = () => {
  const { state } = useNavigation()
  const { pathname } = useLocation()

  const isLoginPage = pathname === '/sign-in'
  const isSignUpPage = pathname === '/sign-up'
  const isLoading = state === 'loading'

  return (
    <div className="flex flex-col h-screen overflow-hidden selection:bg-primary/10">
      <Toaster position="top-right" richColors theme="light" />
      {isLoading && <PageLoader />}
      <Header />
      <main className="flex-1 overflow-y-auto bg-white bg-cover bg-center relative">
        <div className="flex flex-col min-h-full">
          <Outlet />
        </div>
      </main>

      {isLoginPage || isSignUpPage ? <Footer /> : null}
    </div>
  )
}

export default MainPage
