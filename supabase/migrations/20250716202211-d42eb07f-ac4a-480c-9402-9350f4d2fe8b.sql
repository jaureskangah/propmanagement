-- Fix critical security issues identified by the linter

-- 1. Enable RLS on tables that are missing it
-- Check which tables need RLS enabled (ERROR: RLS Disabled in Public)
-- Based on the schema, these are likely the tables without RLS

-- Enable RLS on rent_payment_reminders table
ALTER TABLE public.rent_payment_reminders ENABLE ROW LEVEL SECURITY;

-- Create appropriate policies for rent_payment_reminders
CREATE POLICY "Users can view reminders for their tenants" 
ON public.rent_payment_reminders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.tenants 
    WHERE tenants.id = rent_payment_reminders.tenant_id 
    AND tenants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create reminders for their tenants" 
ON public.rent_payment_reminders 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tenants 
    WHERE tenants.id = rent_payment_reminders.tenant_id 
    AND tenants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update reminders for their tenants" 
ON public.rent_payment_reminders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.tenants 
    WHERE tenants.id = rent_payment_reminders.tenant_id 
    AND tenants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete reminders for their tenants" 
ON public.rent_payment_reminders 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.tenants 
    WHERE tenants.id = rent_payment_reminders.tenant_id 
    AND tenants.user_id = auth.uid()
  )
);

-- 2. Fix function search paths (WARN: Function Search Path Mutable)
-- Update functions to have SET search_path to 'public' for security

-- Fix calculate_average_rating function
CREATE OR REPLACE FUNCTION public.calculate_average_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.rating = ROUND((NEW.quality_rating + NEW.price_rating + NEW.punctuality_rating)::numeric / 3, 1);
  RETURN NEW;
END;
$function$;

-- Fix update_thread_status function
CREATE OR REPLACE FUNCTION public.update_thread_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        UPDATE tenant_communications
        SET status = 'read'
        WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$function$;

-- Fix update_vendor_rating function
CREATE OR REPLACE FUNCTION public.update_vendor_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Calculer la nouvelle note moyenne pour le prestataire concerné
  UPDATE vendors 
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM vendor_reviews 
    WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
  )
  WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, first_name, last_name, email, is_tenant_user)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    (new.raw_user_meta_data->>'is_tenant_user')::boolean
  );
  return new;
end;
$function$;