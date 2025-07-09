-- Enable realtime for tenant_communications table
ALTER TABLE public.tenant_communications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tenant_communications;

-- Add email notification preferences to tenant table for payment alerts
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "payment_reminders": true}'::jsonb;