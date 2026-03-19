-- ============================================================
-- SETUP DA TABELA profiles + trigger de criação automática
-- Execute no Supabase > SQL Editor
-- ============================================================

-- 1. Cria a tabela (se ainda não existir)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text,
  full_name   text,
  role        text NOT NULL DEFAULT 'user',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Habilita RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove TODAS as políticas existentes na tabela (independente do nome)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
  END LOOP;
END;
$$;

-- 3. Função auxiliar SECURITY DEFINER para checar role sem recursão
--    Roda como dono da função (bypass de RLS), evita loop infinito
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 4. Políticas RLS

-- Qualquer usuário autenticado pode LER todos os perfis
-- (necessário para o app listar usuários e carregar o próprio perfil)
CREATE POLICY "Autenticados lêem perfis"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Usuário insere apenas o próprio perfil
CREATE POLICY "Usuário insere o próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Usuário atualiza apenas o próprio perfil
CREATE POLICY "Usuário atualiza o próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin atualiza qualquer perfil (usa get_my_role sem recursão)
CREATE POLICY "Admin atualiza todos os perfis"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- 5. Função trigger: cria perfil automaticamente ao registrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER          -- ignora RLS, roda como superusuário
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 6. Trigger disparado após INSERT em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Backfill: cria perfil para usuários que já existem em auth.users
--    mas ainda não têm linha em profiles (ex: o seu usuário atual)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  'user'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);
