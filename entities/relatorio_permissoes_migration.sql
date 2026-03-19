-- Migração opcional para suporte completo das novas permissões
-- Execute no Supabase SQL Editor

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS estados text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'comercial';

ALTER TABLE public."RelatorioQualidade"
  ADD COLUMN IF NOT EXISTS visivel_comercial boolean NOT NULL DEFAULT true;

-- Opcional: garantir papéis válidos no perfil
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_role_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('admin', 'arquitetura', 'comercial'));
  END IF;
END;
$$;
