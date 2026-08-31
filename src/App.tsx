import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Universo from './pages/Universo'
import Guia from './pages/Guia'
import Tarot from './pages/Tarot'
import TarotDiario from './pages/TarotDiario'
import IChing from './pages/IChing'
import Omikuji from './pages/Omikuji'
import BaZi from './pages/BaZi'
import Numerologia from './pages/Numerologia'
import Tradiciones from './pages/Tradiciones'
import Runas from './pages/Runas'
import LunaOracle from './pages/LunaOracle'
import SuenosOracle from './pages/SuenosOracle'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/universo" element={<Universo />} />
        <Route path="/guia" element={<Guia />} />
        <Route path="/tarot" element={<Tarot />} />
        <Route path="/tarot-diario" element={<TarotDiario />} />
        <Route path="/iching" element={<IChing />} />
        <Route path="/omikuji" element={<Omikuji />} />
        <Route path="/bazi" element={<BaZi />} />
        <Route path="/numerologia" element={<Numerologia />} />
        <Route path="/tradiciones" element={<Tradiciones />} />
        <Route path="/runas" element={<Runas />} />
        <Route path="/luna" element={<LunaOracle />} />
        <Route path="/suenos" element={<SuenosOracle />} />
      </Routes>
    </BrowserRouter>
  )
}