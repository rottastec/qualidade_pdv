-- ============================================================
-- RLS para tabelas PDV e RelatorioQualidade
-- Execute no Supabase > SQL Editor
-- ============================================================

-- ============================================================
-- TABELA: PDV
-- ============================================================

-- Garante que RLS está habilitado
ALTER TABLE public."PDV" ENABLE ROW LEVEL SECURITY;

-- Remove políticas existentes para recriar do zero
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'PDV' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public."PDV"', r.policyname);
  END LOOP;
END;
$$;

-- Qualquer usuário autenticado pode LER todos os PDVs
CREATE POLICY "Autenticados lêem PDVs"
  ON public."PDV" FOR SELECT
  USING (auth.role() = 'authenticated');

-- Somente admin e arquitetura podem INSERIR
CREATE POLICY "Admin e arquitetura inserem PDVs"
  ON public."PDV" FOR INSERT
  WITH CHECK (public.get_my_role() IN ('admin', 'arquitetura'));

-- Somente admin e arquitetura podem ATUALIZAR
CREATE POLICY "Admin e arquitetura atualizam PDVs"
  ON public."PDV" FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'arquitetura'));

-- Somente admin pode DELETAR
CREATE POLICY "Admin deleta PDVs"
  ON public."PDV" FOR DELETE
  USING (public.get_my_role() = 'admin');


-- ============================================================
-- TABELA: RelatorioQualidade
-- ============================================================

-- Garante que RLS está habilitado
ALTER TABLE public."RelatorioQualidade" ENABLE ROW LEVEL SECURITY;

-- Garante que a coluna visivel_comercial existe
ALTER TABLE public."RelatorioQualidade"
  ADD COLUMN IF NOT EXISTS visivel_comercial boolean NOT NULL DEFAULT true;

-- Remove políticas existentes para recriar do zero
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'RelatorioQualidade' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public."RelatorioQualidade"', r.policyname);
  END LOOP;
END;
$$;

-- Admin e arquitetura lêem TODOS os relatórios
CREATE POLICY "Admin e arquitetura lêem todos os relatórios"
  ON public."RelatorioQualidade" FOR SELECT
  USING (public.get_my_role() IN ('admin', 'arquitetura'));

-- Comercial lê apenas relatórios visíveis e do seu estado
-- (estados é um array no perfil; pdv_estado deve estar no array permitido)
CREATE POLICY "Comercial lê relatórios visíveis do seu estado"
  ON public."RelatorioQualidade" FOR SELECT
  USING (
    public.get_my_role() = 'comercial'
    AND visivel_comercial = true
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public."PDV" pdv ON pdv.id::text = "RelatorioQualidade".pdv_id
      WHERE p.id = auth.uid()
        AND (
          p.estados = '{}'::text[]   -- sem restrição de estado: vê todos
          OR pdv.estado = ANY(p.estados)
        )
    )
  );

-- Somente admin e arquitetura podem INSERIR relatórios
CREATE POLICY "Admin e arquitetura inserem relatórios"
  ON public."RelatorioQualidade" FOR INSERT
  WITH CHECK (public.get_my_role() IN ('admin', 'arquitetura'));

-- Somente admin e arquitetura podem ATUALIZAR relatórios
CREATE POLICY "Admin e arquitetura atualizam relatórios"
  ON public."RelatorioQualidade" FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'arquitetura'));

-- Somente admin pode DELETAR relatórios
CREATE POLICY "Admin deleta relatórios"
  ON public."RelatorioQualidade" FOR DELETE
  USING (public.get_my_role() = 'admin');
