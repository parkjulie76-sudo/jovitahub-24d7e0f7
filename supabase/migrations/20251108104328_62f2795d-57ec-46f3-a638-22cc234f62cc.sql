-- Make thumbnail_url NOT NULL for videos table since it's now required
-- First update any existing NULL values with a placeholder
UPDATE public.videos 
SET thumbnail_url = 'https://drive.google.com/file/d/placeholder' 
WHERE thumbnail_url IS NULL;

-- Then alter the column to NOT NULL
ALTER TABLE public.videos 
ALTER COLUMN thumbnail_url SET NOT NULL;