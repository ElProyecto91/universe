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
import DiceOracle from './pages/DiceOracle'
import Bibliomancia from './pages/Bibliomancia'
import OghamOracle from './pages/OghamOracle'
import PaganPaths from './pages/PaganPaths'
import Lithomancy from './pages/Lithomancy'
import AnimalOracle from './pages/AnimalOracle'
import Scrying from './pages/Scrying'
import ElementOracle from './pages/ElementOracle'
import WheelOfYear from './pages/WheelOfYear'
import CoinOracle from './pages/CoinOracle'
import OracleMix from './pages/OracleMix'
import OmensOracle from './pages/OmensOracle'
import Disclaimer from './pages/Disclaimer'

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
        <Route path="/dados" element={<DiceOracle />} />
        <Route path="/bibliomancia" element={<Bibliomancia />} />
        <Route path="/ogham" element={<OghamOracle />} />
        <Route path="/pagan" element={<PaganPaths />} />
        <Route path="/litomancia" element={<Lithomancy />} />
        <Route path="/animales" element={<AnimalOracle />} />
        <Route path="/scrying" element={<Scrying />} />
        <Route path="/elementos" element={<ElementOracle />} />
        <Route path="/rueda" element={<WheelOfYear />} />
        <Route path="/monedas" element={<CoinOracle />} />
        <Route path="/oracle-mix" element={<OracleMix />} />
        <Route path="/presagios" element={<OmensOracle />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </BrowserRouter>
  )
}