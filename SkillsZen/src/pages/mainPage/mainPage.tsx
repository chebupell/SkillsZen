import React from 'react';
import { Header } from '../../components/shared/header';
import { Outlet } from 'react-router-dom';

const MainPage: React.FC = () => {
  return (
    <div>
      <Header></Header>
      <main>
        <Outlet></Outlet>
        <div className="bg-[url('/background-images/main-page-background.png')] bg-fixed bg-cover bg-center w-90 h-90"></div>
      </main>
    </div>
  );
};

export default MainPage;
