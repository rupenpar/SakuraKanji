import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { JlptLevelPage } from './pages/JlptLevelPage'
import { LandingPage } from './pages/LandingPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:level" element={<JlptLevelPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
