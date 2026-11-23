-- ============================================================================
-- Endurecimiento de seguridad (2026-11-06). Se aplica DESPUÉS de la baseline.
--
-- Principio: no cambia ningún comportamiento que el frontend use hoy. Cada
-- cambio se comprobó contra las llamadas reales de src/ (ver notas).
--
-- NO resuelve (necesita cambios de frontend o de diseño; ver "Pendiente" abajo):
--   * ai_cache: cualquiera puede INSERTAR entradas (el navegador cachea).
--   * sesiones_experto: el usuario puede fijar importes al insertar.
--   * Kill switch del panel Admin (escribe columnas que no existen).
-- ============================================================================


-- ─── 1. ai_usage: solo el servidor escribe ──────────────────────────────────
-- Antes: cualquier usuario logueado podía insertar filas con su user_id y un
-- coste_usd arbitrario, y con ello agotar el presupuesto diario de TODOS
-- (la Edge Function bloquea la IA al llegar al tope).
-- La Edge Function escribe con service_role (BYPASSRLS); el cliente ya no
-- inserta (gemini.ts:144). Solo lee su propio conteo (SELECT, sin cambios).

drop policy if exists "ai_usage_insert" on public.ai_usage;
revoke insert, update, delete, truncate on public.ai_usage from anon, authenticated;
revoke select on public.ai_usage from anon;

-- Los administradores deben ver el gasto global (las vistas pasan a security_invoker).
drop policy if exists "ai_usage_select_admin" on public.ai_usage;
create policy "ai_usage_select_admin" on public.ai_usage for select
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));


-- ─── 2. ai_cache: el cliente solo puede subir el contador de hits ───────────
-- Antes: UPDATE con `using (true)` sobre todas las columnas permitía a
-- cualquiera (incluido anon) reescribir `respuesta` de entradas permanentes
-- (expires_at null) que se sirven a todos los usuarios.
-- Ahora solo se puede actualizar `hits` (gemini.ts:89), que es lo único que
-- el frontend actualiza. INSERT/SELECT no cambian.

revoke update, delete, truncate on public.ai_cache from anon, authenticated;
grant update (hits) on public.ai_cache to anon, authenticated;


-- ─── 3. incrementar_consulta: solo para el propio usuario ───────────────────
-- Antes: SECURITY DEFINER, ejecutable por anon, y actualizaba el perfil del
-- user_id que se le pasara (subir el contador de otro usuario conociendo su UUID).
-- Ahora ignora cualquier id que no sea el del llamante. Firma intacta, así que
-- gemini.ts:145 y useUserPlan.ts:101 siguen funcionando.

create or replace function public.incrementar_consulta(user_id_param uuid)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
BEGIN
  IF user_id_param IS DISTINCT FROM auth.uid() THEN
    RETURN;
  END IF;

  UPDATE profiles
  SET
    consultas_hoy = CASE
      WHEN consultas_hoy_fecha < CURRENT_DATE THEN 1
      ELSE consultas_hoy + 1
    END,
    consultas_hoy_fecha = CURRENT_DATE
  WHERE id = user_id_param;
END;
$function$;

revoke execute on function public.incrementar_consulta(uuid) from public, anon;
grant execute on function public.incrementar_consulta(uuid) to authenticated, service_role;


-- ─── 4. Funciones: search_path fijo y ejecución mínima ──────────────────────
alter function public.es_admin() set search_path = public;
alter function public.reset_consultas_si_nuevo_dia() set search_path = public;

-- es_admin(): anon no la necesita. authenticated se mantiene (devuelve un boolean).
revoke execute on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated, service_role;

-- Función de trigger: Postgres solo comprueba EXECUTE al crear el trigger, no al
-- dispararlo, así que no hace falta que nadie pueda llamarla por /rpc.
revoke execute on function public.proteger_columnas_profiles() from public, anon, authenticated;


-- ─── 5. Vistas: respetan el RLS de quien consulta ───────────────────────────
-- Antes: las 18 vistas eran del usuario `postgres` y se saltaban el RLS, así que
-- cualquier usuario logueado leía métricas que la política de analytics_eventos
-- reserva a los administradores.
-- Ahora: analytics_eventos/ai_usage aplican sus políticas (admin o propio).
-- La Edge Function usa service_role y sigue viendo el gasto global.
-- El panel Admin (admin_users) sigue viendo todo.

alter view public.ai_costes_resumen set (security_invoker = true);
alter view public.ai_gasto_hoy set (security_invoker = true);
alter view public.ai_gasto_mes set (security_invoker = true);
alter view public.horoscopo_cache_status set (security_invoker = true);
alter view public.v_dispositivos set (security_invoker = true);
alter view public.v_flujo_navegacion set (security_invoker = true);
alter view public.v_herramientas_ranking set (security_invoker = true);
alter view public.v_intenciones set (security_invoker = true);
alter view public.v_modelos_ia set (security_invoker = true);
alter view public.v_paywalls set (security_invoker = true);
alter view public.v_retencion set (security_invoker = true);
alter view public.v_satisfaccion set (security_invoker = true);
alter view public.v_uso_por_dia_semana set (security_invoker = true);
alter view public.v_uso_por_hora set (security_invoker = true);
alter view public.v_usuarios_diarios set (security_invoker = true);
alter view public.v_usuarios_por_edad set (security_invoker = true);
alter view public.v_usuarios_por_pais set (security_invoker = true);
alter view public.v_usuarios_por_signo set (security_invoker = true);


-- ─── 6. Tablas heredadas sin uso en src/ ────────────────────────────────────
-- wallets, transactions, expert_sessions y experts (0 filas; ninguna se
-- referencia en src/). wallets_update dejaba al usuario editar su propio saldo
-- y experts_select exponía stripe_account_id. Se cierran hasta que se usen.

revoke all on public.wallets from anon, authenticated;
revoke all on public.transactions from anon, authenticated;
revoke all on public.expert_sessions from anon, authenticated;
revoke all on public.experts from anon, authenticated;


-- ============================================================================
-- Pendiente (no incluido a propósito)
--   * ai_cache INSERT abierto: una entrada puede sembrarse antes de que un
--     usuario legítimo la genere. Solución real: que escriba la Edge Function.
--   * sesiones_experto: el usuario inserta importe_total/importe_* desde el
--     cliente (ExpertoPerfil.tsx:149). Calcularlos en servidor antes de Stripe.
--   * ai_config: Admin.tsx escribe kill_switch/presupuesto_diario/_mensual
--     (no existen; las columnas son activo, presupuesto_diario_usd,
--     presupuesto_mensual_usd) y no hay política UPDATE para admins.
--   * Admin.tsx lee total_eur; las vistas devuelven gasto_usd_hoy/_mes.
--   * analytics_eventos: INSERT anónimo sin validar (spam).
--   * Contraseñas filtradas (HaveIBeenPwned): activar en el panel de Auth.
--
-- Reversión (si algo falla):
--   create policy "ai_usage_insert" on public.ai_usage for insert
--     with check ((select auth.uid()) = user_id);
--   grant insert, update, delete on public.ai_usage to anon, authenticated;
--   grant select on public.ai_usage to anon;
--   grant update, delete on public.ai_cache to anon, authenticated;
--   -- (la función incrementar_consulta anterior está en la migración baseline)
--   grant execute on function public.incrementar_consulta(uuid) to public, anon;
--   alter view public.<vista> reset (security_invoker);   -- las 18 vistas
--   grant all on public.wallets, public.transactions,
--     public.expert_sessions, public.experts to anon, authenticated;
-- ============================================================================
