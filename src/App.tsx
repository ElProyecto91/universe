import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Universo from './pages/Universo'
import Guia from './pages/Guia'
import Tarot from './pages/Tarot'
import TarotDiario from './pages/TarotDiario'
import Tarot78 from './pages/Tarot78'
import IChing from './pages/IChing'
import Omikuji from './pages/Omikuji'
import BaZi from './pages/BaZi'
import Numerologia from './pages/Numerologia'
import NumerologiaNombre from './pages/NumerologiaNombre'
import NumerologiaUniversal from './pages/NumerologiaUniversal'
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
import PlantOracle from './pages/PlantOracle'
import ChakraOracle from './pages/ChakraOracle'
import Compatibilidad from './pages/Compatibilidad'
import AstroDaily from './pages/AstroDaily'
import ColorOracle from './pages/ColorOracle'
import TibetanMo from './pages/TibetanMo'
import AnoPersonal from './pages/AnoPersonal'
import MirrorOracle from './pages/MirrorOracle'
import Geomancia from './pages/Geomancia'
import Sincronicidad from './pages/Sincronicidad'
import Tzolkin from './pages/Tzolkin'
import HoroscopoCeltico from './pages/HoroscopoCeltico'
import ZiWei from './pages/ZiWei'
import Horoscopo from './pages/Horoscopo'
import Cristales from './pages/Cristales'
import Manifestacion from './pages/Manifestacion'
import TestArquetipo from './pages/TestArquetipo'
import Afirmaciones from './pages/Afirmaciones'
import RuedaVida from './pages/RuedaVida'
import Palmisteria from './pages/Palmisteria'
import Meditacion from './pages/Meditacion'
import Rituales from './pages/Rituales'
import CartaNatal from './pages/CartaNatal'
import Transitos from './pages/Transitos'
import Diario from './pages/Diario'
import VisionBoard from './pages/VisionBoard'
import Biorritmos from './pages/Biorritmos'

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
        <Route path="/tarot78" element={<Tarot78 />} />
        <Route path="/iching" element={<IChing />} />
        <Route path="/omikuji" element={<Omikuji />} />
        <Route path="/bazi" element={<BaZi />} />
        <Route path="/numerologia" element={<Numerologia />} />
        <Route path="/numerologia-nombre" element={<NumerologiaNombre />} />
        <Route path="/numerologia-universal" element={<NumerologiaUniversal />} />
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
        <Route path="/plantas" element={<PlantOracle />} />
        <Route path="/chakras" element={<ChakraOracle />} />
        <Route path="/compatibilidad" element={<Compatibilidad />} />
        <Route path="/astro-daily" element={<AstroDaily />} />
        <Route path="/color" element={<ColorOracle />} />
        <Route path="/tibetan-mo" element={<TibetanMo />} />
        <Route path="/ano-personal" element={<AnoPersonal />} />
        <Route path="/mirror" element={<MirrorOracle />} />
        <Route path="/geomancia" element={<Geomancia />} />
        <Route path="/sincronicidad" element={<Sincronicidad />} />
        <Route path="/tzolkin" element={<Tzolkin />} />
        <Route path="/horoscopo-celtico" element={<HoroscopoCeltico />} />
        <Route path="/zi-wei" element={<ZiWei />} />
        <Route path="/horoscopo" element={<Horoscopo />} />
        <Route path="/cristales" element={<Cristales />} />
        <Route path="/manifestacion" element={<Manifestacion />} />
        <Route path="/arquetipo" element={<TestArquetipo />} />
        <Route path="/afirmaciones" element={<Afirmaciones />} />
        <Route path="/rueda-vida" element={<RuedaVida />} />
        <Route path="/palmisteria" element={<Palmisteria />} />
        <Route path="/meditacion" element={<Meditacion />} />
        <Route path="/rituales" element={<Rituales />} />
        <Route path="/carta-natal" element={<CartaNatal />} />
        <Route path="/transitos" element={<Transitos />} />
        <Route path="/diario" element={<Diario />} />
        <Route path="/vision-board" element={<VisionBoard />} />
        <Route path="/biorritmos" element={<Biorritmos />} />
      </Routes>
    </BrowserRouter>
  )
}