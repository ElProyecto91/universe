import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Universo from './pages/Universo'
import Guia from './pages/Guia'
import Tarot from './pages/Tarot'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/universo" element={<Universo />} />
        <Route path="/guia" element={<Guia />} />
        <Route path="/tarot" element={<Tarot />} />
      </Routes>
    </BrowserRouter>
  )
}