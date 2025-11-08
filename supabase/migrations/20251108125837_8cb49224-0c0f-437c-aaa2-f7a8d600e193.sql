-- Make scripts bucket private so RLS policies apply
UPDATE storage.buckets 
SET public = false 
WHERE id = 'scripts';