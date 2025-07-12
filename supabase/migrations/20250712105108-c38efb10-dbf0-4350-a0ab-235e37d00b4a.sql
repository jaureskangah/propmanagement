-- Enable realtime for admin dashboard tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.properties REPLICA IDENTITY FULL;
ALTER TABLE public.tenants REPLICA IDENTITY FULL;
ALTER TABLE public.tenant_payments REPLICA IDENTITY FULL;
ALTER TABLE public.maintenance_requests REPLICA IDENTITY FULL;
ALTER TABLE public.admin_metrics REPLICA IDENTITY FULL;

-- Add tables to realtime publication (check if not already added)
DO $$
BEGIN
    -- Add profiles to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    END IF;
    
    -- Add properties to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'properties'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
    END IF;
    
    -- Add tenant_payments to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'tenant_payments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tenant_payments;
    END IF;
    
    -- Add maintenance_requests to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'maintenance_requests'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_requests;
    END IF;
    
    -- Add admin_metrics to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'admin_metrics'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_metrics;
    END IF;
END $$;