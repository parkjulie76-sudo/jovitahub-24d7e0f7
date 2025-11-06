-- Add script_writer and video_creator roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'script_writer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'video_creator';