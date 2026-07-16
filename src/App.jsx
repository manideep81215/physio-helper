import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ExercisePage from './pages/ExercisePage.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExercisePage />} />
      </Routes>
      <InstallPrompt />
    </HashRouter>
  )
}
