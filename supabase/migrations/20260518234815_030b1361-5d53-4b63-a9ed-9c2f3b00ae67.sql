CREATE TABLE IF NOT EXISTS public.funil_estagios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT DEFAULT '#6366f1',
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funil_estagios ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own funnel stages" 
ON public.funil_estagios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own funnel stages" 
ON public.funil_estagios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funnel stages" 
ON public.funil_estagios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own funnel stages" 
ON public.funil_estagios 
FOR DELETE 
USING (auth.uid() = user_id);
