-- =====================================================
-- Bank Sampah Bakti Alam — Direct Supabase Setup
-- Frontend Vite langsung akses Supabase via anon key.
-- Tidak perlu Express/Railway lagi.
-- Jalankan file ini di Supabase SQL Editor.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- Tables
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  rt TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  reset_password_token TEXT,
  reset_password_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deposits (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'completed',
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Custom lightweight session table for this project.
-- Ini menggantikan JWT Express lama.
CREATE TABLE IF NOT EXISTS public.app_sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_app_sessions_user_id ON public.app_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_app_sessions_expires_at ON public.app_sessions(expires_at);

-- =====================================================
-- Security
-- =====================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_sessions ENABLE ROW LEVEL SECURITY;

-- Drop old broad policies from the Express/service-role version.
DROP POLICY IF EXISTS "Service role full access on users" ON public.users;
DROP POLICY IF EXISTS "Service role full access on deposits" ON public.deposits;
DROP POLICY IF EXISTS "Service role full access on notifications" ON public.notifications;

-- Do not expose raw tables directly to anon/authenticated clients.
-- Frontend only talks through SECURITY DEFINER RPC functions below.
REVOKE ALL ON TABLE public.users FROM anon, authenticated;
REVOKE ALL ON TABLE public.deposits FROM anon, authenticated;
REVOKE ALL ON TABLE public.notifications FROM anon, authenticated;
REVOKE ALL ON TABLE public.app_sessions FROM anon, authenticated;

-- =====================================================
-- Helpers
-- =====================================================
CREATE OR REPLACE FUNCTION public.app_user_json(u public.users)
RETURNS jsonb
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'id', u.id,
    'username', u.username,
    'email', u.email,
    'name', u.name,
    'role', COALESCE(u.role, 'user'),
    'rt', u.rt,
    'createdAt', u.created_at
  );
$$;

-- =====================================================
-- Auth RPC
-- =====================================================
CREATE OR REPLACE FUNCTION public.app_login(
  p_identifier TEXT,
  p_password TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user public.users%ROWTYPE;
  v_token TEXT;
BEGIN
  SELECT * INTO v_user
  FROM public.users
  WHERE lower(username) = lower(trim(p_identifier))
     OR lower(email) = lower(trim(p_identifier))
  LIMIT 1;

  IF v_user.id IS NULL OR v_user.password <> crypt(p_password, v_user.password) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Email atau password salah');
  END IF;

  DELETE FROM public.app_sessions WHERE expires_at <= now();

  v_token := encode(gen_random_bytes(32), 'hex');

  INSERT INTO public.app_sessions (token, user_id, expires_at)
  VALUES (v_token, v_user.id, now() + interval '7 days');

  RETURN jsonb_build_object(
    'success', true,
    'token', v_token,
    'user', public.app_user_json(v_user)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.app_register(
  p_username TEXT,
  p_name TEXT,
  p_email TEXT,
  p_rt TEXT,
  p_password TEXT,
  p_role TEXT DEFAULT 'user',
  p_session_token TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
  v_role TEXT := 'user';
  v_user public.users%ROWTYPE;
BEGIN
  IF length(trim(COALESCE(p_username, ''))) < 2 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Username minimal 2 karakter');
  END IF;

  IF length(trim(COALESCE(p_name, ''))) < 2 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Nama minimal 2 karakter');
  END IF;

  IF COALESCE(p_email, '') !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Format email tidak valid');
  END IF;

  IF length(COALESCE(p_password, '')) < 6 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Password minimal 6 karakter');
  END IF;

  -- Public registration is always role user.
  -- Admin can create another role only when the session token belongs to admin.
  IF COALESCE(p_role, 'user') <> 'user' THEN
    SELECT u.* INTO v_actor
    FROM public.app_sessions s
    JOIN public.users u ON u.id = s.user_id
    WHERE s.token = p_session_token
      AND s.expires_at > now()
    LIMIT 1;

    IF v_actor.id IS NULL OR v_actor.role <> 'admin' THEN
      RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    v_role := p_role;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.users
    WHERE lower(username) = lower(trim(p_username))
       OR lower(email) = lower(trim(p_email))
  ) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Username atau email sudah digunakan');
  END IF;

  INSERT INTO public.users (username, name, email, rt, password, role)
  VALUES (
    trim(p_username),
    trim(p_name),
    lower(trim(p_email)),
    NULLIF(trim(COALESCE(p_rt, '')), ''),
    crypt(p_password, gen_salt('bf', 10)),
    v_role
  )
  RETURNING * INTO v_user;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Registrasi berhasil',
    'user', public.app_user_json(v_user)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.app_forgot_password(
  p_email TEXT,
  p_origin TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user public.users%ROWTYPE;
  v_token TEXT;
  v_hashed_token TEXT;
  v_reset_url TEXT;
BEGIN
  SELECT * INTO v_user
  FROM public.users
  WHERE lower(email) = lower(trim(p_email))
  LIMIT 1;

  IF v_user.id IS NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Jika email terdaftar, link reset telah dibuat.'
    );
  END IF;

  v_token := encode(gen_random_bytes(32), 'hex');
  v_hashed_token := encode(digest(v_token, 'sha256'), 'hex');

  UPDATE public.users
  SET reset_password_token = v_hashed_token,
      reset_password_expires = now() + interval '1 hour'
  WHERE id = v_user.id;

  v_reset_url := rtrim(COALESCE(NULLIF(p_origin, ''), 'http://localhost:5173'), '/') || '/reset-password/' || v_token;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Link reset password dibuat: ' || v_reset_url,
    'resetUrl', v_reset_url
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.app_reset_password(
  p_token TEXT,
  p_password TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hashed_token TEXT;
  v_user_id TEXT;
BEGIN
  IF COALESCE(p_token, '') !~ '^[a-f0-9]{64}$' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Format token tidak valid');
  END IF;

  IF length(COALESCE(p_password, '')) < 6 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Password minimal 6 karakter');
  END IF;

  v_hashed_token := encode(digest(p_token, 'sha256'), 'hex');

  SELECT id INTO v_user_id
  FROM public.users
  WHERE reset_password_token = v_hashed_token
    AND reset_password_expires > now()
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Token tidak valid atau sudah kadaluarsa');
  END IF;

  UPDATE public.users
  SET password = crypt(p_password, gen_salt('bf', 10)),
      reset_password_token = NULL,
      reset_password_expires = NULL
  WHERE id = v_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Password berhasil diubah. Silakan masuk dengan password baru.');
END;
$$;

-- =====================================================
-- Users RPC
-- =====================================================
CREATE OR REPLACE FUNCTION public.app_get_users(p_session_token TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
  v_result jsonb;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  SELECT COALESCE(jsonb_agg(public.app_user_json(u) ORDER BY u.created_at DESC), '[]'::jsonb)
  INTO v_result
  FROM public.users u
  WHERE u.role = 'user';

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.app_update_user(
  p_session_token TEXT,
  p_id TEXT,
  p_username TEXT,
  p_name TEXT,
  p_email TEXT,
  p_rt TEXT,
  p_password TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' AND v_actor.id <> p_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.users
    WHERE id <> p_id
      AND (
        lower(username) = lower(trim(COALESCE(p_username, '')))
        OR lower(email) = lower(trim(COALESCE(p_email, '')))
      )
  ) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Username atau email sudah digunakan');
  END IF;

  UPDATE public.users
  SET username = trim(COALESCE(p_username, username)),
      name = trim(COALESCE(p_name, name)),
      email = lower(trim(COALESCE(p_email, email))),
      rt = NULLIF(trim(COALESCE(p_rt, rt, '')), '')
  WHERE id = p_id;

  IF p_password IS NOT NULL AND length(p_password) >= 6 THEN
    UPDATE public.users
    SET password = crypt(p_password, gen_salt('bf', 10))
    WHERE id = p_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'Data nasabah berhasil diperbarui');
END;
$$;

CREATE OR REPLACE FUNCTION public.app_delete_user(
  p_session_token TEXT,
  p_id TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  DELETE FROM public.users WHERE id = p_id AND role = 'user';

  RETURN jsonb_build_object('success', true, 'message', 'Nasabah berhasil dihapus');
END;
$$;

-- =====================================================
-- Deposits RPC
-- =====================================================
CREATE OR REPLACE FUNCTION public.app_get_deposits(p_session_token TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
  v_result jsonb;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', d.id,
        'userId', d.user_id,
        'items', d.items,
        'totalAmount', d.total_amount,
        'date', d.date,
        'status', d.status,
        'priority', d.priority,
        'createdAt', d.created_at,
        'depositorName', u.name
      ) ORDER BY d.created_at DESC
    ),
    '[]'::jsonb
  ) INTO v_result
  FROM public.deposits d
  LEFT JOIN public.users u ON u.id = d.user_id;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.app_get_deposits_by_user(
  p_session_token TEXT,
  p_user_id TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
  v_result jsonb;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' AND v_actor.id <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', d.id,
        'userId', d.user_id,
        'items', d.items,
        'totalAmount', d.total_amount,
        'date', d.date,
        'status', d.status,
        'priority', d.priority,
        'createdAt', d.created_at,
        'depositorName', u.name
      ) ORDER BY d.created_at DESC
    ),
    '[]'::jsonb
  ) INTO v_result
  FROM public.deposits d
  LEFT JOIN public.users u ON u.id = d.user_id
  WHERE d.user_id = p_user_id;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.app_add_deposit(
  p_session_token TEXT,
  p_user_id TEXT,
  p_items JSONB,
  p_total_amount NUMERIC,
  p_date DATE,
  p_status TEXT,
  p_priority TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
  v_id TEXT;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  INSERT INTO public.deposits (user_id, items, total_amount, date, status, priority)
  VALUES (p_user_id, COALESCE(p_items, '[]'::jsonb), COALESCE(p_total_amount, 0), p_date, COALESCE(p_status, 'completed'), COALESCE(p_priority, 'normal'))
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('success', true, 'id', v_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.app_update_deposit(
  p_session_token TEXT,
  p_id TEXT,
  p_user_id TEXT,
  p_items JSONB,
  p_total_amount NUMERIC,
  p_date DATE,
  p_status TEXT,
  p_priority TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  UPDATE public.deposits
  SET user_id = p_user_id,
      items = COALESCE(p_items, '[]'::jsonb),
      total_amount = COALESCE(p_total_amount, 0),
      date = p_date,
      status = COALESCE(p_status, 'completed'),
      priority = COALESCE(p_priority, 'normal')
  WHERE id = p_id;

  RETURN jsonb_build_object('success', true, 'message', 'Deposit updated');
END;
$$;

CREATE OR REPLACE FUNCTION public.app_delete_deposit(
  p_session_token TEXT,
  p_id TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  DELETE FROM public.deposits WHERE id = p_id;

  RETURN jsonb_build_object('success', true, 'message', 'Deposit deleted');
END;
$$;

-- =====================================================
-- Notifications RPC
-- =====================================================
CREATE OR REPLACE FUNCTION public.app_get_notifications(
  p_session_token TEXT,
  p_user_id TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
  v_result jsonb;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' AND v_actor.id <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', n.id,
        'userId', n.user_id,
        'title', n.title,
        'message', n.message,
        'type', n.type,
        'isRead', n.is_read,
        'date', n.created_at,
        'createdAt', n.created_at
      ) ORDER BY n.created_at DESC
    ),
    '[]'::jsonb
  ) INTO v_result
  FROM public.notifications n
  WHERE n.user_id = p_user_id;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.app_add_notification(
  p_session_token TEXT,
  p_user_id TEXT,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
  v_id TEXT;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (p_user_id, trim(p_title), trim(p_message), COALESCE(NULLIF(trim(p_type), ''), 'info'))
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('success', true, 'id', v_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.app_mark_notification_read(
  p_session_token TEXT,
  p_id TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
  v_owner_id TEXT;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  SELECT user_id INTO v_owner_id FROM public.notifications WHERE id = p_id;

  IF v_actor.role <> 'admin' AND v_actor.id <> v_owner_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  UPDATE public.notifications SET is_read = true WHERE id = p_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.app_clear_notifications(
  p_session_token TEXT,
  p_user_id TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor public.users%ROWTYPE;
BEGIN
  SELECT u.* INTO v_actor
  FROM public.app_sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.token = p_session_token
    AND s.expires_at > now()
  LIMIT 1;

  IF v_actor.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  IF v_actor.role <> 'admin' AND v_actor.id <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Forbidden');
  END IF;

  DELETE FROM public.notifications WHERE user_id = p_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Allow browser clients to call RPC functions.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- Seed admin
-- Default login:
-- username: admin
-- password: admin123
-- =====================================================
INSERT INTO public.users (id, username, name, email, password, role)
VALUES (
  'admin-1',
  'admin',
  'Admin Bakti Alam',
  'admin@baktialam.com',
  crypt('admin123', gen_salt('bf', 10)),
  'admin'
)
ON CONFLICT (id)
DO UPDATE SET
  username = EXCLUDED.username,
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  role = EXCLUDED.role;
