import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AlgoPage from './pages/exercises/algoPage/algoPage'
import JSPage from './pages/exercises/jsPage/jsPage'
import TSPage from './pages/exercises/tsPage/tsPage'

function App() {
  return (
    <div className="app-container">
      <h1>SkillsZen</h1>

      <BrowserRouter>
        <Routes>
          <Route path='js' element={<JSPage />} />
          <Route path='ts' element={<TSPage />} />
          <Route path='algo' element={<AlgoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
