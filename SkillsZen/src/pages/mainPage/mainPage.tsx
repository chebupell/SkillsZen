import React from 'react';
import { Header } from '../../components/shared/header';
import { Outlet } from 'react-router-dom';

const MainPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default MainPage;
