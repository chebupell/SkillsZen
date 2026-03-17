import React from 'react'
import { Header } from '../../components/shared/header'
import { Outlet } from 'react-router-dom'
import { Toaster } from '../../components/ui/sonner'

const MainPage: React.FC = () => {
  return (
    <div>
      <Toaster position="top-right" richColors theme="light"/>
      <Header />
      <main className="flex flex-col">
        <Outlet></Outlet>
      </main>
    </div>
  )
}

export default MainPage
