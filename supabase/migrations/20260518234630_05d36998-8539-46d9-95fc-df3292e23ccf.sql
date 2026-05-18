CREATE TABLE IF NOT EXISTS public.respostas_rapidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  atalho TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, atalho)
);

-- Enable RLS
ALTER TABLE public.respostas_rapidas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own quick responses" 
ON public.respostas_rapidas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quick responses" 
ON public.respostas_rapidas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quick responses" 
ON public.respostas_rapidas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quick responses" 
ON public.respostas_rapidas 
FOR DELETE 
USING (auth.uid() = user_id);
