
-- Ajouter la colonne vendor_id à la table maintenance_expenses
ALTER TABLE public.maintenance_expenses 
ADD COLUMN vendor_id uuid REFERENCES public.vendors(id);

-- Ajouter un index pour améliorer les performances des requêtes avec vendor_id
CREATE INDEX idx_maintenance_expenses_vendor_id ON public.maintenance_expenses(vendor_id);

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.maintenance_expenses.vendor_id IS 'Foreign key to vendors table - optional, allows linking expenses to specific vendors';
