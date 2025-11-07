-- Create profiles table for user information with serial number
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  serial_number TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create sequence for user serial numbers
CREATE SEQUENCE IF NOT EXISTS user_serial_seq START 1;

-- Create function to generate user serial number
CREATE OR REPLACE FUNCTION generate_user_serial()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'USER-' || LPAD(nextval('user_serial_seq')::TEXT, 6, '0');
END;
$$;

-- Create trigger function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, serial_number, first_name, last_name)
  VALUES (
    NEW.id,
    generate_user_serial(),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add serial number column to scripts table
ALTER TABLE public.scripts ADD COLUMN IF NOT EXISTS serial_number TEXT UNIQUE;

-- Create sequence for script serial numbers
CREATE SEQUENCE IF NOT EXISTS script_serial_seq START 1;

-- Create function to generate script serial number
CREATE OR REPLACE FUNCTION generate_script_serial()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'SCRIPT-' || LPAD(nextval('script_serial_seq')::TEXT, 6, '0');
END;
$$;

-- Create trigger function for scripts
CREATE OR REPLACE FUNCTION set_script_serial()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    NEW.serial_number := generate_script_serial();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for scripts
DROP TRIGGER IF EXISTS set_script_serial_trigger ON public.scripts;
CREATE TRIGGER set_script_serial_trigger
  BEFORE INSERT ON public.scripts
  FOR EACH ROW
  EXECUTE FUNCTION set_script_serial();

-- Add serial number column to videos table
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS serial_number TEXT UNIQUE;

-- Create sequence for video serial numbers
CREATE SEQUENCE IF NOT EXISTS video_serial_seq START 1;

-- Create function to generate video serial number
CREATE OR REPLACE FUNCTION generate_video_serial()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'VIDEO-' || LPAD(nextval('video_serial_seq')::TEXT, 6, '0');
END;
$$;

-- Create trigger function for videos
CREATE OR REPLACE FUNCTION set_video_serial()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    NEW.serial_number := generate_video_serial();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for videos
DROP TRIGGER IF EXISTS set_video_serial_trigger ON public.videos;
CREATE TRIGGER set_video_serial_trigger
  BEFORE INSERT ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION set_video_serial();

-- Update existing scripts with serial numbers
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id FROM public.scripts WHERE serial_number IS NULL ORDER BY created_at
  LOOP
    UPDATE public.scripts SET serial_number = generate_script_serial() WHERE id = rec.id;
  END LOOP;
END $$;

-- Update existing videos with serial numbers
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id FROM public.videos WHERE serial_number IS NULL ORDER BY created_at
  LOOP
    UPDATE public.videos SET serial_number = generate_video_serial() WHERE id = rec.id;
  END LOOP;
END $$;

-- Create trigger for updating updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();