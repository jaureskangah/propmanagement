-- Add rent_amount column to properties table
ALTER TABLE public.properties 
ADD COLUMN rent_amount NUMERIC DEFAULT 0;