-- Enable realtime for commission_splits table
ALTER TABLE public.commission_splits REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.commission_splits;