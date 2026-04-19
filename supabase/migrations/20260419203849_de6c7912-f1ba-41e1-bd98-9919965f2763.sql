CREATE TABLE public.n8n_chat_histories (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  message JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_n8n_chat_histories_session_id ON public.n8n_chat_histories(session_id);
CREATE INDEX idx_n8n_chat_histories_created_at ON public.n8n_chat_histories(created_at DESC);

ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read chat histories"
ON public.n8n_chat_histories FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated can insert chat histories"
ON public.n8n_chat_histories FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can delete chat histories"
ON public.n8n_chat_histories FOR DELETE TO authenticated
USING (true);