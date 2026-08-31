import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function guardarPerfil(userId: string, datos: Record<string, string>) {
  await supabase
    .from('profiles')
    .upsert({ id: userId, name: datos.nombre || '', language: 'es' })

  if (datos.fechaNacimiento) {
    await supabase
      .from('birth_data')
      .upsert({
        user_id: userId,
        birth_date: datos.fechaNacimiento,
        birth_time: datos.horaNacimiento || null,
        birth_city: datos.ciudad || '',
      })
  }
}

export async function cerrarSesion() {
  await supabase.auth.signOut()
  window.location.href = '/'
}