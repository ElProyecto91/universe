# Semitua (repo `universe`)

PWA espiritual (tarot, astrología, numerología, oráculos y práctica espiritual) con un sistema de
expertos humanos. La marca es **Semitua**; el repo, el paquete y parte del código aún dicen "universe".
Dominio: `semitua.com`. Rama de producción: `main` (despliega sola en Vercel).

> Este archivo es público (el repo lo es). No añadas aquí claves, secretos, correos, precios,
> estrategia de negocio ni listas de debilidades: eso va en notas privadas.

## Stack
React 18 · TypeScript · Vite 5 · Tailwind 3 · react-router-dom 6 · Supabase (Auth, Postgres, Edge
Functions) · Vercel · GitHub Actions · vite-plugin-pwa · Gemini (siempre a través de una Edge Function).

## Comandos
- `npm install` · `npm run dev` · `npm run build` (es `vite build`).
- `tsc` no forma parte del build y hay errores de tipos anteriores. No añadas errores nuevos:
  `npx tsc -p tsconfig.app.json --noEmit` y compara el recuento antes y después.

## Estructura
```
api/cron/horoscopo-batch.ts      Cron diario de Vercel (horóscopos). Idempotente.
supabase/functions/gemini/       Edge Function: único punto de entrada a Gemini.
supabase/migrations/             Esquema de la base de datos, en SQL idempotente.
src/pages/                       Una página por herramienta, más Auth, Perfil, Admin, Legal, Expertos…
src/lib/                         gemini.ts (llamarGemini), supabase.ts, motores de cálculo, utilidades.
src/hooks/                       useUserPlan, useAnalytics, useHistorial.
src/components/                  PageLayout, TextoIA, Paywall, DisclaimerIA, Valoracion, etc.
.github/workflows/               deploy-edge-functions, monitor-gemini, security-review.
```

## Cómo se usa la IA
- Toda llamada a Gemini desde la app pasa por `llamarGemini()` (`src/lib/gemini.ts`), que llama a la
  Edge Function `gemini`. La función valida el usuario, limita tamaño, aplica el kill switch
  (`ai_config.activo`), el presupuesto y el rate limit, y registra el uso en `ai_usage`.
- **Nunca** llames a `generativelanguage.googleapis.com` desde el navegador ni metas la clave de Gemini
  en el frontend. Solo `api/cron/` (servidor) llama a Gemini directamente.
- **Nunca** uses el prefijo `VITE_` para claves de IA o de pago: todo lo que lleva `VITE_` acaba en el
  JavaScript público.
- Las claves viven solo en secretos de Supabase (Edge Functions) o variables de Vercel.

## Base de datos
- Todo cambio de esquema es un archivo nuevo en `supabase/migrations/` (`AAAAMMDDHHMMSS_nombre.sql`),
  idempotente (`if not exists`, `create or replace`, `drop policy if exists`).
- La migración `20261106000000_baseline_schema.sql` describe el esquema real. **Consúltala antes de
  escribir una consulta con columnas nuevas**: hubo código que usaba columnas que no existían
  (`total_eur`, `kill_switch`…) y fallaba sin avisar.
- Todas las tablas tienen RLS. Un `update` que el RLS bloquea no da error: devuelve 0 filas. Añade
  `.select('id')` y comprueba que vuelve al menos una fila antes de dar el cambio por hecho.
- La app no debe depender de que el cliente escriba en tablas de uso o de configuración de IA: esas
  escrituras son del servidor (service role).

## Despliegue
- Push a `main` → Vercel. Trabaja en una rama y abre PR; no empujes a `main` directamente.
- Cambios en `supabase/functions/**` → workflow **Deploy Edge Functions**. Una Edge Function rota
  deja la IA caída para todos: pruébala antes.

## Reglas de código del proyecto (las fija el dueño)
- Overlays oscuros con estilo inline: `style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}`. Nunca
  `bg-black/92` (no existe en Tailwind y no pinta nada).
- Cards: `bg-[#0d0015] border border-white/15`, fondo sólido; destacadas `border-purple-500/50`.
- Texto `text-white`; secundario como mucho `text-white/50`; apoyo `text-purple-300`.
  Botón principal `bg-gradient-to-r from-purple-600 to-pink-600`. Radios `rounded-2xl` / `rounded-3xl`.
- Los prompts se construyen con `array.join('\n')`, nunca con template literals multilínea, y empiezan
  con: "Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown."
- Los cálculos se hacen en el frontend, nunca en el prompt.
- El texto de IA se muestra con `<TextoIA texto={…} />` / `limpiarMarkdown()`.
- Cada herramienta usa `useUserPlan`, `useAnalytics`, `PageLayout`, `TextoIA`, `DisclaimerIA`,
  `Valoracion` e `incrementarConsulta`.
- La IA genera reflexión, nunca predicciones ("vas a enfermar", "tu pareja te engaña" están prohibidas).
- Marca: fondo `#0d0015`, morado `#a855f7`, dorado `#C8980A`.

## Trabajo con el dueño
- Responde en español, sin rodeos. Si algo es incierto, dilo y marca el nivel de certeza.
- Entrega archivos completos, no fragmentos, y un cambio cada vez.
- Trabaja desde el móvil: cuando algo solo pueda hacerlo él (secretos, aprobaciones), dáselo en pasos
  cortos.
