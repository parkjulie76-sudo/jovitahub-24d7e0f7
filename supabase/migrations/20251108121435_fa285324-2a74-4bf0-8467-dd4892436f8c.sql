-- Update scripts bucket to be public so uploaded files can be accessed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'scripts';