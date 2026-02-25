import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#efefef]">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
