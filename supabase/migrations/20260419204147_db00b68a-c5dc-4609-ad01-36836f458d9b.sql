CREATE TABLE public.agent_prompts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_prompts_user_id ON public.agent_prompts(user_id);

-- Garante apenas 1 ativo por usuário
CREATE UNIQUE INDEX idx_agent_prompts_unique_active
ON public.agent_prompts(user_id) WHERE ativo = true;

ALTER TABLE public.agent_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own prompts"
ON public.agent_prompts FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own prompts"
ON public.agent_prompts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own prompts"
ON public.agent_prompts FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users delete own prompts"
ON public.agent_prompts FOR DELETE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));