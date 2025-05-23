-- Create ideas table
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    votes INTEGER DEFAULT 0
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read ideas
CREATE POLICY "Allow public read access" ON public.ideas
    FOR SELECT
    USING (true);

-- Allow anyone to insert ideas
CREATE POLICY "Allow public insert" ON public.ideas
    FOR INSERT
    WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_ideas_created_at ON public.ideas(created_at DESC);
CREATE INDEX idx_ideas_category ON public.ideas(category);
CREATE INDEX idx_ideas_status ON public.ideas(status); 