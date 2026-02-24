import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app-container min-h-screen bg-gray-50">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
