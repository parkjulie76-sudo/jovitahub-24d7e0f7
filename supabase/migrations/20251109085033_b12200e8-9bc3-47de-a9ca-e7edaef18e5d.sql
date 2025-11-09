-- Add YouTube and TikTok links to videos table
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS youtube_link text,
ADD COLUMN IF NOT EXISTS tiktok_link text,
ADD COLUMN IF NOT EXISTS sales_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS posted_at timestamp with time zone;