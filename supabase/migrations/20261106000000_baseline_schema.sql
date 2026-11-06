-- ============================================================================
-- Baseline del esquema `public` (extraído de producción el 2026-11-06).
--
-- Documenta el estado REAL de la base de datos tal cual está hoy, incluidos
-- sus defectos. No corrige nada: los cambios de seguridad van en migraciones
-- posteriores.
--
-- Es idempotente (IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS), así que
-- aplicarla sobre producción no debería alterar nada. Aun así, como el
-- historial de migraciones de producción está vacío, lo recomendable es
-- marcarla como aplicada en vez de ejecutarla:
--     supabase migration repair --status applied 20261106000000
--
-- No incluye: esquemas auth/storage, extensiones, GRANTs (se usan los
-- predeterminados de Supabase) ni datos.
-- ============================================================================

-- ─── Tablas ─────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid not null,
  name text,
  language text default 'en',
  created_at timestamptz default now(),
  plan text default 'free',
  plan_inicio timestamptz,
  plan_fin timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  consultas_hoy integer default 0,
  consultas_hoy_fecha date default current_date,
  email text,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users(id),
  constraint profiles_plan_check check (plan = any (array['free','premium']))
);

create table if not exists public.admin_users (
  user_id uuid not null,
  created_at timestamptz default now(),
  constraint admin_users_pkey primary key (user_id),
  constraint admin_users_user_id_fkey foreign key (user_id) references auth.users(id)
);

create table if not exists public.ai_cache (
  id uuid not null default gen_random_uuid(),
  cache_key text not null,
  herramienta text not null,
  prompt_hash text not null,
  respuesta text not null,
  tokens_used integer default 0,
  hits integer default 1,
  expires_at timestamptz,
  created_at timestamptz default now(),
  constraint ai_cache_pkey primary key (id),
  constraint ai_cache_cache_key_key unique (cache_key)
);

create table if not exists public.ai_config (
  id integer not null default 1,
  activo boolean default true,
  presupuesto_diario_usd numeric default 5.00,
  presupuesto_mensual_usd numeric default 50.00,
  limite_calls_hora_free integer default 10,
  limite_calls_dia_free integer default 30,
  limite_calls_hora_premium integer default 50,
  limite_calls_dia_premium integer default 200,
  updated_at timestamptz default now(),
  constraint ai_config_pkey primary key (id),
  constraint solo_una_fila check (id = 1)
);

create table if not exists public.ai_usage (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  herramienta text not null,
  tokens_input integer default 0,
  tokens_output integer default 0,
  coste_usd numeric default 0,
  created_at timestamptz default now(),
  constraint ai_usage_pkey primary key (id),
  constraint ai_usage_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

create table if not exists public.analytics_eventos (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  session_id text,
  es_nuevo_usuario boolean default false,
  num_sesion integer default 1,
  es_premium boolean default false,
  evento text not null,
  herramienta text,
  herramienta_anterior text,
  desde_cache boolean default false,
  tiempo_ms integer,
  modelo_ia text,
  valoracion smallint,
  llego_paywall boolean default false,
  limite_alcanzado boolean default false,
  completo_lectura boolean default false,
  signo_zodiacal text,
  rango_edad text,
  intencion text,
  pais_iso char(2),
  region text,
  dispositivo text,
  navegador text,
  idioma text,
  hora_dia smallint,
  dia_semana smallint,
  created_at timestamptz default now(),
  constraint analytics_eventos_pkey primary key (id),
  constraint analytics_eventos_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null
);

create table if not exists public.astrology_profiles (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  sun_sign text,
  moon_sign text,
  rising_sign text,
  raw_data jsonb,
  created_at timestamptz default now(),
  constraint astrology_profiles_pkey primary key (id),
  constraint astrology_profiles_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade
);

create table if not exists public.birth_data (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  birth_date date,
  birth_time time,
  birth_city text,
  birth_country text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz default now(),
  constraint birth_data_pkey primary key (id),
  constraint birth_data_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade
);

create table if not exists public.conversations (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  summary text,
  memory_objects jsonb,
  created_at timestamptz default now(),
  constraint conversations_pkey primary key (id),
  constraint conversations_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade
);

create table if not exists public.messages (
  id uuid not null default gen_random_uuid(),
  conversation_id uuid,
  role text,
  content text,
  created_at timestamptz default now(),
  constraint messages_pkey primary key (id),
  constraint messages_conversation_id_fkey foreign key (conversation_id) references public.conversations(id) on delete cascade,
  constraint messages_role_check check (role = any (array['user','assistant']))
);

create table if not exists public.readings (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  spread_type text,
  summary text,
  created_at timestamptz default now(),
  constraint readings_pkey primary key (id),
  constraint readings_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade
);

create table if not exists public.reading_cards (
  id uuid not null default gen_random_uuid(),
  reading_id uuid,
  position integer,
  card_name text,
  is_reversed boolean default false,
  interpretation text,
  constraint reading_cards_pkey primary key (id),
  constraint reading_cards_reading_id_fkey foreign key (reading_id) references public.readings(id) on delete cascade
);

create table if not exists public.expertos (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  slug text not null,
  nombre text not null,
  nombre_artistico text,
  foto_url text,
  bio text,
  especialidades text[] default '{}',
  metodos text[] default '{}',
  precio_minuto numeric default 3.50,
  minutos_gratis integer default 3,
  idiomas text[] default '{Español}',
  disponible boolean default false,
  activo boolean default true,
  verificado boolean default false,
  total_sesiones integer default 0,
  total_minutos integer default 0,
  valoracion_media numeric default 0,
  total_valoraciones integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  pin text,
  nivel text default 'nuevo',
  estado text default 'offline',
  video_url text,
  especialidad_tematica text[] default '{}',
  acepta_email boolean default false,
  precio_email numeric default 9.99,
  acepta_webinar boolean default false,
  precio_webinar numeric default 19.99,
  total_regalos integer default 0,
  total_favoritos integer default 0,
  ultima_sesion timestamptz,
  constraint expertos_pkey primary key (id),
  constraint expertos_pin_key unique (pin),
  constraint expertos_slug_key unique (slug),
  constraint expertos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

-- Familia en inglés (0 filas en producción; probablemente heredada)
create table if not exists public.experts (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  name text,
  bio text,
  languages text[],
  specialties text[],
  price_per_min numeric default 2.00,
  is_online boolean default false,
  rating numeric default 0,
  total_reviews integer default 0,
  stripe_account_id text,
  created_at timestamptz default now(),
  constraint experts_pkey primary key (id),
  constraint experts_user_id_fkey foreign key (user_id) references auth.users(id)
);

create table if not exists public.expert_sessions (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  expert_id uuid,
  status text default 'pending',
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  total_charged numeric,
  constraint expert_sessions_pkey primary key (id),
  constraint expert_sessions_expert_id_fkey foreign key (expert_id) references public.experts(id),
  constraint expert_sessions_user_id_fkey foreign key (user_id) references public.profiles(id)
);

create table if not exists public.wallets (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  balance numeric default 0,
  constraint wallets_pkey primary key (id),
  constraint wallets_user_id_key unique (user_id),
  constraint wallets_user_id_fkey foreign key (user_id) references public.profiles(id)
);

create table if not exists public.transactions (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  amount numeric,
  type text,
  session_id uuid,
  stripe_payment_id text,
  created_at timestamptz default now(),
  constraint transactions_pkey primary key (id),
  constraint transactions_session_id_fkey foreign key (session_id) references public.expert_sessions(id),
  constraint transactions_user_id_fkey foreign key (user_id) references public.profiles(id),
  constraint transactions_type_check check (type = any (array['topup','charge','refund']))
);

create table if not exists public.horoscopo_cache (
  id uuid not null default gen_random_uuid(),
  signo text not null,
  fecha date not null,
  tipo text not null default 'diario',
  contenido text not null,
  tokens_used integer,
  created_at timestamptz default now(),
  constraint horoscopo_cache_pkey primary key (id)
);

create table if not exists public.historial_lecturas (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  herramienta text not null,
  titulo text not null,
  contenido text not null,
  metadatos jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  constraint historial_lecturas_pkey primary key (id),
  constraint historial_lecturas_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

create table if not exists public.sesiones_experto (
  id uuid not null default gen_random_uuid(),
  experto_id uuid,
  usuario_id uuid,
  estado text default 'pendiente',
  tipo text default 'chat',
  minutos_gratis_usados boolean default false,
  duracion_minutos integer default 0,
  precio_minuto numeric,
  importe_total numeric default 0,
  importe_experto numeric default 0,
  importe_plataforma numeric default 0,
  notas_previas text,
  iniciada_at timestamptz,
  finalizada_at timestamptz,
  created_at timestamptz default now(),
  constraint sesiones_experto_pkey primary key (id),
  constraint sesiones_experto_experto_id_fkey foreign key (experto_id) references public.expertos(id) on delete cascade,
  constraint sesiones_experto_usuario_id_fkey foreign key (usuario_id) references auth.users(id) on delete cascade
);

create table if not exists public.resenas_experto (
  id uuid not null default gen_random_uuid(),
  experto_id uuid,
  usuario_id uuid,
  sesion_id uuid,
  valoracion integer,
  comentario text,
  created_at timestamptz default now(),
  constraint resenas_experto_pkey primary key (id),
  constraint resenas_experto_experto_id_fkey foreign key (experto_id) references public.expertos(id) on delete cascade,
  constraint resenas_experto_sesion_id_fkey foreign key (sesion_id) references public.sesiones_experto(id) on delete cascade,
  constraint resenas_experto_usuario_id_fkey foreign key (usuario_id) references auth.users(id) on delete cascade,
  constraint resenas_experto_valoracion_check check (valoracion >= 1 and valoracion <= 5)
);

create table if not exists public.disponibilidad_experto (
  id uuid not null default gen_random_uuid(),
  experto_id uuid,
  dia_semana integer,
  hora_inicio time,
  hora_fin time,
  constraint disponibilidad_experto_pkey primary key (id),
  constraint disponibilidad_experto_experto_id_fkey foreign key (experto_id) references public.expertos(id) on delete cascade
);

create table if not exists public.regalos_experto (
  id uuid not null default gen_random_uuid(),
  experto_id uuid,
  usuario_id uuid,
  tipo text not null,
  emoji text not null,
  nombre text not null,
  valor_eur numeric not null,
  mensaje text,
  created_at timestamptz default now(),
  constraint regalos_experto_pkey primary key (id),
  constraint regalos_experto_experto_id_fkey foreign key (experto_id) references public.expertos(id) on delete cascade,
  constraint regalos_experto_usuario_id_fkey foreign key (usuario_id) references auth.users(id) on delete cascade
);

create table if not exists public.favoritos_experto (
  id uuid not null default gen_random_uuid(),
  experto_id uuid,
  usuario_id uuid,
  notificar_conexion boolean default true,
  created_at timestamptz default now(),
  constraint favoritos_experto_pkey primary key (id),
  constraint favoritos_experto_experto_id_usuario_id_key unique (experto_id, usuario_id),
  constraint favoritos_experto_experto_id_fkey foreign key (experto_id) references public.expertos(id) on delete cascade,
  constraint favoritos_experto_usuario_id_fkey foreign key (usuario_id) references auth.users(id) on delete cascade
);

create table if not exists public.webinars_experto (
  id uuid not null default gen_random_uuid(),
  experto_id uuid,
  titulo text not null,
  descripcion text,
  fecha timestamptz not null,
  duracion_minutos integer default 60,
  precio_eur numeric not null,
  max_participantes integer default 20,
  participantes_actuales integer default 0,
  estado text default 'programado',
  created_at timestamptz default now(),
  constraint webinars_experto_pkey primary key (id),
  constraint webinars_experto_experto_id_fkey foreign key (experto_id) references public.expertos(id) on delete cascade
);

create table if not exists public.consultas_email (
  id uuid not null default gen_random_uuid(),
  experto_id uuid,
  usuario_id uuid,
  pregunta text not null,
  respuesta text,
  precio_eur numeric not null,
  estado text default 'pendiente',
  created_at timestamptz default now(),
  respondida_at timestamptz,
  constraint consultas_email_pkey primary key (id),
  constraint consultas_email_experto_id_fkey foreign key (experto_id) references public.expertos(id) on delete cascade,
  constraint consultas_email_usuario_id_fkey foreign key (usuario_id) references auth.users(id) on delete cascade
);

-- ─── Índices ────────────────────────────────────────────────────────────────

create index if not exists idx_ai_cache_expires on public.ai_cache using btree (expires_at);
create index if not exists idx_ai_cache_key on public.ai_cache using btree (cache_key);
create index if not exists idx_ai_usage_date on public.ai_usage using btree (created_at);
create index if not exists idx_ai_usage_user_date on public.ai_usage using btree (user_id, created_at);
create index if not exists idx_analytics_evento_date on public.analytics_eventos using btree (evento, created_at);
create index if not exists idx_analytics_herramienta_date on public.analytics_eventos using btree (herramienta, created_at);
create index if not exists idx_analytics_pais on public.analytics_eventos using btree (pais_iso, created_at);
create index if not exists idx_analytics_signo on public.analytics_eventos using btree (signo_zodiacal, created_at);
create index if not exists idx_analytics_user_date on public.analytics_eventos using btree (user_id, created_at);
create index if not exists idx_consultas_experto on public.consultas_email using btree (experto_id, estado);
create index if not exists idx_expertos_disponible on public.expertos using btree (disponible, activo);
create index if not exists idx_expertos_valoracion on public.expertos using btree (valoracion_media desc);
create index if not exists idx_favoritos_experto on public.favoritos_experto using btree (experto_id);
create index if not exists idx_favoritos_usuario on public.favoritos_experto using btree (usuario_id);
create index if not exists idx_historial_user_id on public.historial_lecturas using btree (user_id, created_at desc);
create unique index if not exists idx_horoscopo_cache_lookup on public.horoscopo_cache using btree (signo, fecha, tipo);
create index if not exists idx_profiles_stripe on public.profiles using btree (stripe_customer_id);
create index if not exists idx_resenas_experto on public.resenas_experto using btree (experto_id, created_at desc);
create index if not exists idx_sesiones_experto on public.sesiones_experto using btree (experto_id, created_at desc);
create index if not exists idx_sesiones_usuario on public.sesiones_experto using btree (usuario_id, created_at desc);
create index if not exists idx_webinars_fecha on public.webinars_experto using btree (fecha);

-- ─── Funciones y triggers ───────────────────────────────────────────────────

create or replace function public.es_admin()
 returns boolean
 language sql
 security definer
as $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND id = '4f474f52-a126-453d-a779-04e4bfda0391'
  );
$function$;

create or replace function public.incrementar_consulta(user_id_param uuid)
 returns void
 language plpgsql
 security definer
as $function$
BEGIN
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

create or replace function public.proteger_columnas_profiles()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if auth.uid() is null or public.es_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.plan := 'free';
    new.plan_inicio := null;
    new.plan_fin := null;
    new.stripe_customer_id := null;
    new.stripe_subscription_id := null;
    return new;
  end if;

  if new.plan_inicio is distinct from old.plan_inicio
     or new.plan_fin is distinct from old.plan_fin
     or new.stripe_customer_id is distinct from old.stripe_customer_id
     or new.stripe_subscription_id is distinct from old.stripe_subscription_id
     or (new.plan is distinct from old.plan
         and not (new.plan = 'free' and new.plan_fin is null)) then
    raise exception 'No autorizado para modificar el plan';
  end if;

  return new;
end $function$;

create or replace function public.reset_consultas_si_nuevo_dia()
 returns trigger
 language plpgsql
as $function$
BEGIN
  IF NEW.consultas_hoy_fecha < CURRENT_DATE THEN
    NEW.consultas_hoy := 0;
    NEW.consultas_hoy_fecha := CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$function$;

drop trigger if exists trigger_reset_consultas on public.profiles;
create trigger trigger_reset_consultas
  before update on public.profiles
  for each row execute function public.reset_consultas_si_nuevo_dia();

drop trigger if exists trg_proteger_profiles on public.profiles;
create trigger trg_proteger_profiles
  before insert or update on public.profiles
  for each row execute function public.proteger_columnas_profiles();

-- ─── Vistas ─────────────────────────────────────────────────────────────────

create or replace view public.ai_gasto_hoy as
 select round(sum(coste_usd), 6) as gasto_usd_hoy
 from ai_usage
 where created_at >= current_date;

create or replace view public.ai_gasto_mes as
 select round(sum(coste_usd), 4) as gasto_usd_mes
 from ai_usage
 where date_trunc('month', created_at) = date_trunc('month', now());

create or replace view public.ai_costes_resumen as
 select date(created_at) as fecha,
        herramienta,
        count(*) as total_llamadas,
        sum(tokens_input) as tokens_input_total,
        sum(tokens_output) as tokens_output_total,
        round(sum(coste_usd), 4) as coste_usd_total
 from ai_usage
 group by date(created_at), herramienta
 order by date(created_at) desc, round(sum(coste_usd), 4) desc;

create or replace view public.horoscopo_cache_status as
 select fecha,
        count(*) as signos_generados,
        sum(tokens_used) as tokens_totales,
        min(created_at) as primera_generacion,
        max(created_at) as ultima_generacion
 from horoscopo_cache
 group by fecha
 order by fecha desc;

create or replace view public.v_herramientas_ranking as
 select herramienta,
        count(*) as total_usos,
        count(distinct user_id) as usuarios_unicos,
        round(avg(tiempo_ms)) as tiempo_medio_ms,
        round(avg(case when desde_cache then 0 else 1 end) * 100::numeric) as pct_llamadas_reales,
        sum(case when valoracion = 1 then 1 else 0 end) as thumbs_up,
        sum(case when valoracion = -1 then 1 else 0 end) as thumbs_down,
        sum(case when llego_paywall then 1 else 0 end) as paywalls,
        round(sum(case when completo_lectura then 1 else 0 end)::numeric / nullif(count(*), 0)::numeric * 100::numeric) as pct_completadas
 from analytics_eventos
 where herramienta is not null
 group by herramienta
 order by count(*) desc;

create or replace view public.v_usuarios_diarios as
 select date(created_at) as fecha,
        count(distinct user_id) as usuarios_activos,
        count(distinct case when es_nuevo_usuario then user_id else null::uuid end) as usuarios_nuevos,
        count(distinct case when es_premium then user_id else null::uuid end) as usuarios_premium,
        count(*) as total_eventos,
        sum(case when llego_paywall then 1 else 0 end) as paywalls_totales,
        sum(case when limite_alcanzado then 1 else 0 end) as limites_alcanzados
 from analytics_eventos
 where created_at >= now() - interval '30 days'
 group by date(created_at)
 order by date(created_at) desc;

create or replace view public.v_uso_por_hora as
 select hora_dia,
        count(*) as total_eventos,
        count(distinct user_id) as usuarios_unicos
 from analytics_eventos
 where created_at >= now() - interval '7 days'
 group by hora_dia
 order by hora_dia;

create or replace view public.v_uso_por_dia_semana as
 select case dia_semana
          when 0 then 'Domingo'
          when 1 then 'Lunes'
          when 2 then 'Martes'
          when 3 then 'Miércoles'
          when 4 then 'Jueves'
          when 5 then 'Viernes'
          when 6 then 'Sábado'
          else null::text
        end as dia,
        dia_semana,
        count(*) as total_eventos,
        count(distinct user_id) as usuarios_unicos
 from analytics_eventos
 where created_at >= now() - interval '30 days'
 group by dia_semana
 order by dia_semana;

create or replace view public.v_usuarios_por_pais as
 select pais_iso,
        count(distinct user_id) as usuarios_unicos,
        count(*) as total_eventos,
        count(distinct case when es_premium then user_id else null::uuid end) as usuarios_premium
 from analytics_eventos
 where pais_iso is not null
 group by pais_iso
 order by count(distinct user_id) desc;

create or replace view public.v_usuarios_por_signo as
 select signo_zodiacal,
        count(distinct user_id) as usuarios_unicos,
        count(*) as total_usos,
        round(avg(case when es_premium then 1 else 0 end) * 100::numeric) as pct_premium
 from analytics_eventos
 where signo_zodiacal is not null
 group by signo_zodiacal
 order by count(distinct user_id) desc;

create or replace view public.v_usuarios_por_edad as
 select rango_edad,
        count(distinct user_id) as usuarios_unicos,
        count(*) as total_usos,
        round(avg(case when es_premium then 1 else 0 end) * 100::numeric) as pct_premium,
        count(distinct case when llego_paywall then user_id else null::uuid end) as llegaron_paywall
 from analytics_eventos
 where rango_edad is not null
 group by rango_edad
 order by count(distinct user_id) desc;

create or replace view public.v_dispositivos as
 select dispositivo,
        count(distinct user_id) as usuarios_unicos,
        round(count(distinct user_id)::numeric / nullif(sum(count(distinct user_id)) over (), 0::numeric) * 100::numeric) as pct
 from analytics_eventos
 where dispositivo is not null
 group by dispositivo
 order by count(distinct user_id) desc;

create or replace view public.v_flujo_navegacion as
 select herramienta_anterior as origen,
        herramienta as destino,
        count(*) as veces
 from analytics_eventos
 where herramienta_anterior is not null and herramienta is not null
 group by herramienta_anterior, herramienta
 order by count(*) desc
 limit 20;

create or replace view public.v_paywalls as
 select herramienta,
        count(*) as veces_bloqueado,
        count(distinct user_id) as usuarios_bloqueados,
        count(distinct case when rango_edad is not null then rango_edad else null::text end) as rangos_edad_distintos
 from analytics_eventos
 where llego_paywall = true
 group by herramienta
 order by count(*) desc;

create or replace view public.v_satisfaccion as
 select herramienta,
        count(case when valoracion = 1 then 1 else null::integer end) as positivas,
        count(case when valoracion = -1 then 1 else null::integer end) as negativas,
        count(case when valoracion is not null then 1 else null::integer end) as total_valoradas,
        round(count(case when valoracion = 1 then 1 else null::integer end)::numeric
              / nullif(count(case when valoracion is not null then 1 else null::integer end), 0)::numeric
              * 100::numeric) as pct_positivas
 from analytics_eventos
 where herramienta is not null
 group by herramienta
 having count(case when valoracion is not null then 1 else null::integer end) > 0
 order by round(count(case when valoracion = 1 then 1 else null::integer end)::numeric
              / nullif(count(case when valoracion is not null then 1 else null::integer end), 0)::numeric
              * 100::numeric) desc;

create or replace view public.v_retencion as
 select num_sesion,
        count(distinct user_id) as usuarios
 from analytics_eventos
 where num_sesion is not null and user_id is not null
 group by num_sesion
 order by num_sesion;

create or replace view public.v_intenciones as
 select intencion,
        count(distinct user_id) as usuarios,
        count(*) as total_eventos,
        round(avg(case when es_premium then 1 else 0 end) * 100::numeric) as pct_premium
 from analytics_eventos
 where intencion is not null
 group by intencion
 order by count(distinct user_id) desc;

create or replace view public.v_modelos_ia as
 select modelo_ia,
        count(*) as total_llamadas,
        round(avg(tiempo_ms)) as tiempo_medio_ms
 from analytics_eventos
 where modelo_ia is not null and modelo_ia <> 'cache'
 group by modelo_ia
 order by count(*) desc;

-- ─── Row Level Security ─────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.ai_cache enable row level security;
alter table public.ai_config enable row level security;
alter table public.ai_usage enable row level security;
alter table public.analytics_eventos enable row level security;
alter table public.astrology_profiles enable row level security;
alter table public.birth_data enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.readings enable row level security;
alter table public.reading_cards enable row level security;
alter table public.expertos enable row level security;
alter table public.experts enable row level security;
alter table public.expert_sessions enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;
alter table public.horoscopo_cache enable row level security;
alter table public.historial_lecturas enable row level security;
alter table public.sesiones_experto enable row level security;
alter table public.resenas_experto enable row level security;
alter table public.disponibilidad_experto enable row level security;
alter table public.regalos_experto enable row level security;
alter table public.favoritos_experto enable row level security;
alter table public.webinars_experto enable row level security;
alter table public.consultas_email enable row level security;

-- ─── Políticas (todas para el rol `public`, como en producción) ─────────────

-- admin_users
drop policy if exists "admin_users_select" on public.admin_users;
create policy "admin_users_select" on public.admin_users for select
  using (auth.uid() = user_id);

-- ai_cache
drop policy if exists "Inserción autenticada en caché IA" on public.ai_cache;
create policy "Inserción autenticada en caché IA" on public.ai_cache for insert
  with check (true);
drop policy if exists "Lectura pública del caché IA" on public.ai_cache;
create policy "Lectura pública del caché IA" on public.ai_cache for select
  using (true);
drop policy if exists "Update del contador de hits" on public.ai_cache;
create policy "Update del contador de hits" on public.ai_cache for update
  using (true);

-- ai_config
drop policy if exists "Lectura pública de config IA" on public.ai_config;
create policy "Lectura pública de config IA" on public.ai_config for select
  using (true);

-- ai_usage
drop policy if exists "ai_usage_insert" on public.ai_usage;
create policy "ai_usage_insert" on public.ai_usage for insert
  with check ((select auth.uid()) = user_id);
drop policy if exists "ai_usage_select" on public.ai_usage;
create policy "ai_usage_select" on public.ai_usage for select
  using ((select auth.uid()) = user_id);

-- analytics_eventos
drop policy if exists "analytics_insert" on public.analytics_eventos;
create policy "analytics_insert" on public.analytics_eventos for insert
  with check (true);
drop policy if exists "analytics_select_admin" on public.analytics_eventos;
create policy "analytics_select_admin" on public.analytics_eventos for select
  using (exists (select 1 from admin_users where admin_users.user_id = (select auth.uid())));

-- astrology_profiles
drop policy if exists "astrology_profiles_insert" on public.astrology_profiles;
create policy "astrology_profiles_insert" on public.astrology_profiles for insert
  with check (auth.uid() = user_id);
drop policy if exists "astrology_profiles_select" on public.astrology_profiles;
create policy "astrology_profiles_select" on public.astrology_profiles for select
  using (auth.uid() = user_id);
drop policy if exists "astrology_profiles_update" on public.astrology_profiles;
create policy "astrology_profiles_update" on public.astrology_profiles for update
  using (auth.uid() = user_id);

-- birth_data
drop policy if exists "birth_data_insert" on public.birth_data;
create policy "birth_data_insert" on public.birth_data for insert
  with check (auth.uid() = user_id);
drop policy if exists "birth_data_select" on public.birth_data;
create policy "birth_data_select" on public.birth_data for select
  using (auth.uid() = user_id);
drop policy if exists "birth_data_update" on public.birth_data;
create policy "birth_data_update" on public.birth_data for update
  using (auth.uid() = user_id);

-- consultas_email
drop policy if exists "consultas_experto" on public.consultas_email;
create policy "consultas_experto" on public.consultas_email for all
  using (experto_id in (select expertos.id from expertos where expertos.user_id = auth.uid()));
drop policy if exists "consultas_usuario" on public.consultas_email;
create policy "consultas_usuario" on public.consultas_email for all
  using (auth.uid() = usuario_id);

-- conversations
drop policy if exists "conversations_insert" on public.conversations;
create policy "conversations_insert" on public.conversations for insert
  with check (auth.uid() = user_id);
drop policy if exists "conversations_select" on public.conversations;
create policy "conversations_select" on public.conversations for select
  using (auth.uid() = user_id);
drop policy if exists "conversations_update" on public.conversations;
create policy "conversations_update" on public.conversations for update
  using (auth.uid() = user_id);

-- disponibilidad_experto
drop policy if exists "disponibilidad_escritura" on public.disponibilidad_experto;
create policy "disponibilidad_escritura" on public.disponibilidad_experto for all
  using (experto_id in (select expertos.id from expertos where expertos.user_id = auth.uid()));
drop policy if exists "disponibilidad_lectura" on public.disponibilidad_experto;
create policy "disponibilidad_lectura" on public.disponibilidad_experto for select
  using (true);

-- expert_sessions
drop policy if exists "expert_sessions_insert" on public.expert_sessions;
create policy "expert_sessions_insert" on public.expert_sessions for insert
  with check (auth.uid() = user_id);
drop policy if exists "expert_sessions_select" on public.expert_sessions;
create policy "expert_sessions_select" on public.expert_sessions for select
  using ((auth.uid() = user_id) or (auth.uid() = expert_id));
drop policy if exists "expert_sessions_update" on public.expert_sessions;
create policy "expert_sessions_update" on public.expert_sessions for update
  using ((auth.uid() = user_id) or (auth.uid() = expert_id));

-- expertos
drop policy if exists "expertos_select" on public.expertos;
create policy "expertos_select" on public.expertos for select
  using (activo = true);
drop policy if exists "expertos_update" on public.expertos;
create policy "expertos_update" on public.expertos for update
  using ((select auth.uid()) = user_id);

-- experts
drop policy if exists "experts_insert" on public.experts;
create policy "experts_insert" on public.experts for insert
  with check (auth.uid() = user_id);
drop policy if exists "experts_select" on public.experts;
create policy "experts_select" on public.experts for select
  using (true);
drop policy if exists "experts_update" on public.experts;
create policy "experts_update" on public.experts for update
  using (auth.uid() = user_id);

-- favoritos_experto
drop policy if exists "favoritos_lectura_experto" on public.favoritos_experto;
create policy "favoritos_lectura_experto" on public.favoritos_experto for select
  using (experto_id in (select expertos.id from expertos where expertos.user_id = auth.uid()));
drop policy if exists "favoritos_usuario" on public.favoritos_experto;
create policy "favoritos_usuario" on public.favoritos_experto for all
  using (auth.uid() = usuario_id);

-- historial_lecturas
drop policy if exists "historial_delete" on public.historial_lecturas;
create policy "historial_delete" on public.historial_lecturas for delete
  using ((select auth.uid()) = user_id);
drop policy if exists "historial_insert" on public.historial_lecturas;
create policy "historial_insert" on public.historial_lecturas for insert
  with check ((select auth.uid()) = user_id);
drop policy if exists "historial_select" on public.historial_lecturas;
create policy "historial_select" on public.historial_lecturas for select
  using ((select auth.uid()) = user_id);

-- horoscopo_cache
drop policy if exists "Lectura pública del cache" on public.horoscopo_cache;
create policy "Lectura pública del cache" on public.horoscopo_cache for select
  using (true);

-- messages
drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages for insert
  with check (exists (select 1 from conversations c
                      where c.id = messages.conversation_id and c.user_id = auth.uid()));
drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages for select
  using (exists (select 1 from conversations c
                 where c.id = messages.conversation_id and c.user_id = auth.uid()));

-- profiles
drop policy if exists "profiles_delete" on public.profiles;
create policy "profiles_delete" on public.profiles for delete
  using (auth.uid() = id);
drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles for insert
  with check (auth.uid() = id);
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id);
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update
  using (auth.uid() = id);

-- reading_cards
drop policy if exists "reading_cards_insert" on public.reading_cards;
create policy "reading_cards_insert" on public.reading_cards for insert
  with check (exists (select 1 from readings r
                      where r.id = reading_cards.reading_id and r.user_id = auth.uid()));
drop policy if exists "reading_cards_select" on public.reading_cards;
create policy "reading_cards_select" on public.reading_cards for select
  using (exists (select 1 from readings r
                 where r.id = reading_cards.reading_id and r.user_id = auth.uid()));

-- readings
drop policy if exists "readings_insert" on public.readings;
create policy "readings_insert" on public.readings for insert
  with check (auth.uid() = user_id);
drop policy if exists "readings_select" on public.readings;
create policy "readings_select" on public.readings for select
  using (auth.uid() = user_id);

-- regalos_experto
drop policy if exists "regalos_insertar" on public.regalos_experto;
create policy "regalos_insertar" on public.regalos_experto for insert
  with check (auth.uid() = usuario_id);
drop policy if exists "regalos_lectura_publica" on public.regalos_experto;
create policy "regalos_lectura_publica" on public.regalos_experto for select
  using (true);

-- resenas_experto
drop policy if exists "resenas_insert" on public.resenas_experto;
create policy "resenas_insert" on public.resenas_experto for insert
  with check ((select auth.uid()) = usuario_id);
drop policy if exists "resenas_select" on public.resenas_experto;
create policy "resenas_select" on public.resenas_experto for select
  using (true);

-- sesiones_experto
drop policy if exists "sesiones_all_usuario" on public.sesiones_experto;
create policy "sesiones_all_usuario" on public.sesiones_experto for all
  using ((select auth.uid()) = usuario_id);
drop policy if exists "sesiones_select" on public.sesiones_experto;
create policy "sesiones_select" on public.sesiones_experto for select
  using (((select auth.uid()) = usuario_id)
         or exists (select 1 from expertos e
                    where e.id = sesiones_experto.experto_id
                      and e.user_id = (select auth.uid())));

-- transactions
drop policy if exists "transactions_insert" on public.transactions;
create policy "transactions_insert" on public.transactions for insert
  with check (auth.uid() = user_id);
drop policy if exists "transactions_select" on public.transactions;
create policy "transactions_select" on public.transactions for select
  using (auth.uid() = user_id);

-- wallets
drop policy if exists "wallets_select" on public.wallets;
create policy "wallets_select" on public.wallets for select
  using (auth.uid() = user_id);
drop policy if exists "wallets_update" on public.wallets;
create policy "wallets_update" on public.wallets for update
  using (auth.uid() = user_id);

-- webinars_experto
drop policy if exists "webinars_gestion" on public.webinars_experto;
create policy "webinars_gestion" on public.webinars_experto for all
  using (experto_id in (select expertos.id from expertos where expertos.user_id = auth.uid()));
drop policy if exists "webinars_lectura_publica" on public.webinars_experto;
create policy "webinars_lectura_publica" on public.webinars_experto for select
  using (true);
