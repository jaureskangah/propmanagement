-- Create table for automated reminder settings
CREATE TABLE public.reminder_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('rent_payment', 'lease_expiry', 'maintenance_due')),
  enabled BOOLEAN NOT NULL DEFAULT false,
  days_before_due INTEGER NOT NULL DEFAULT 3,
  notification_methods TEXT[] NOT NULL DEFAULT ARRAY['email'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, reminder_type)
);

-- Enable Row Level Security
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for reminder settings
CREATE POLICY "Users can view their own reminder settings" 
ON public.reminder_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminder settings" 
ON public.reminder_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminder settings" 
ON public.reminder_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminder settings" 
ON public.reminder_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reminder_settings_updated_at
BEFORE UPDATE ON public.reminder_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for reminder logs
CREATE TABLE public.reminder_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for reminder logs
CREATE POLICY "Users can view their own reminder logs" 
ON public.reminder_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_reminder_settings_user_type ON public.reminder_settings(user_id, reminder_type);
CREATE INDEX idx_reminder_logs_user_sent_at ON public.reminder_logs(user_id, sent_at DESC);
CREATE INDEX idx_reminder_logs_status ON public.reminder_logs(status, sent_at);

-- Insert default reminder settings for existing users
INSERT INTO public.reminder_settings (user_id, reminder_type, enabled, days_before_due, notification_methods)
SELECT 
  id as user_id,
  'rent_payment' as reminder_type,
  false as enabled,
  3 as days_before_due,
  ARRAY['email'] as notification_methods
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.reminder_settings WHERE reminder_type = 'rent_payment')
ON CONFLICT (user_id, reminder_type) DO NOTHING;