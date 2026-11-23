-- ============================================================================
-- Políticas para que el panel de Admin (src/pages/Admin.tsx) funcione.
-- OPCIONAL y separada de la migración de endurecimiento: AMPLÍA lo que puede
-- hacer una cuenta de administrador. Léela antes de aplicarla.
--
-- Hoy, sin estas políticas, el panel (que ya comprueba el email de admin):
--   * no puede cambiar el kill switch ni los presupuestos (ai_config solo
--     tiene política SELECT; el UPDATE afecta 0 filas sin dar error);
--   * ve solo su propio perfil (profiles_select = solo el propio) y no puede
--     cambiar el plan de otros usuarios.
--
-- "Admin" aquí = fila en public.admin_users (la misma condición que ya usan
-- analytics_select_admin y ai_usage_select_admin). Se comprobó que admin_users
-- tiene 1 fila y que coincide con el UUID de es_admin() y con el email del panel.
-- El trigger trg_proteger_profiles sigue decidiendo qué columnas del plan puede
-- cambiar un admin (es_admin()).
-- ============================================================================

-- Kill switch y presupuestos de IA
drop policy if exists "ai_config_update_admin" on public.ai_config;
create policy "ai_config_update_admin" on public.ai_config for update
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Listado y recuento de usuarios
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles for select
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Cambio de plan desde el panel
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles for update
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Reversión:
--   drop policy "ai_config_update_admin" on public.ai_config;
--   drop policy "profiles_select_admin" on public.profiles;
--   drop policy "profiles_update_admin" on public.profiles;
