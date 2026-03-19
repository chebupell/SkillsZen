import React from 'react'
import { Header } from '../../components/shared/header'
import { Outlet } from 'react-router-dom'
import { Toaster } from '../../components/ui/sonner'
import { Footer } from '../../components/shared/footer'

const MainPage: React.FC = () => {
  return (
    <div>
      <Toaster position="top-right" richColors theme="light"/>
      <Header />
<<<<<<< 4-login-page
      <main className="flex flex-col min-h-full bg-[url('/background-images/main-page-background.png')] bg-cover bg-center">
=======
      <main>
>>>>>>> development
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainPage
