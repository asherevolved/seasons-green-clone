-- Add phone and full_name to addresses table
ALTER TABLE public.addresses 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS full_name text;