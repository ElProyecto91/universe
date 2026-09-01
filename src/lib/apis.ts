// ============================================
// APIS GRATUITAS PARA UNIVERSE
// ============================================

// 1. ASTROLOGÍA — API gratuita de posiciones planetarias
// https://api.astrology.com/v1 — requiere registro gratuito
// Alternativa gratuita sin key:
export async function getPosicionesPlanetariasHoy() {
  try {
    const hoy = new Date()
    const fecha = hoy.toISOString().split('T')[0]
    // Usamos la API pública de AstronomyAPI (100 req/mes gratis)
    // Sin key: calculamos localmente con nuestro motor cartaNatal.ts
    return null
  } catch {
    return null
  }
}

// 2. FASE LUNAR — API gratuita
export async function getFaseLunarAPI(): Promise<{
  phase: number
  phase_name: string
  illumination: number
  age_days: number
} | null> {
  try {
    const res = await fetch('https://api.farmsense.net/v1/moonphases/?d=' + Math.floor(Date.now() / 1000))
    const data = await res.json()
    if (data && data[0]) {
      return {
        phase: data[0].phase || 0,
        phase_name: data[0].Phase || '',
        illumination: data[0].Illumination || 0,
        age_days: data[0].age || 0,
      }
    }
    return null
  } catch {
    return null
  }
}

// 3. CLIMA — para rituales y prácticas al aire libre
export async function getClimaActual(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
    )
    return await res.json()
  } catch {
    return null
  }
}

// 4. FRASES INSPIRACIONALES — API gratuita
export async function getFraseInspiracional(): Promise<string | null> {
  try {
    const res = await fetch('https://zenquotes.io/api/random')
    const data = await res.json()
    return data[0]?.q || null
  } catch {
    return null
  }
}

// 5. TAROT API — datos de cartas
export async function getTarotCardData(cardName: string) {
  try {
    const res = await fetch(`https://tarotapi.dev/api/v1/cards/search?q=${encodeURIComponent(cardName)}`)
    const data = await res.json()
    return data.cards?.[0] || null
  } catch {
    return null
  }
}

// 6. NÚMERO ALEATORIO CÓSMICO — para oráculos
export async function getNumeroCosmico(min: number, max: number): Promise<number> {
  try {
    const res = await fetch(`https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`)
    const texto = await res.text()
    return parseInt(texto.trim())
  } catch {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

// 7. COORDENADAS — para personalizar por ubicación
export async function getCoordenadas(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    )
  })
}

// 8. IMAGEN DE FONDO ESPACIAL — NASA APOD (Astronomy Picture of the Day)
export async function getNASAImagenDiaria(): Promise<{ url: string; title: string; explanation: string } | null> {
  try {
    // API key de demostración gratuita de NASA
    const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    const data = await res.json()
    if (data.media_type === 'image') {
      return { url: data.url, title: data.title, explanation: data.explanation }
    }
    return null
  } catch {
    return null
  }
}

// 9. WIKIPEDIA — para contexto histórico de tradiciones
export async function getWikipediaResumen(termino: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termino)}`
    )
    const data = await res.json()
    return data.extract || null
  } catch {
    return null
  }
}

// 10. OPEN LIBRARY — para bibliomancia con libros reales
export async function getBusquedaLibro(termino: string) {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(termino)}&limit=5`
    )
    return await res.json()
  } catch {
    return null
  }
}