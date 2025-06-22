
-- Supprimer toutes les politiques RLS existantes pour maintenance_expenses
DROP POLICY IF EXISTS "Users can insert their own maintenance expenses" ON public.maintenance_expenses;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.maintenance_expenses;

-- Créer une politique RLS simplifiée pour l'insertion
CREATE POLICY "Allow users to insert maintenance expenses" 
  ON public.maintenance_expenses 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id
  );

-- Vérifier que RLS est activé
ALTER TABLE public.maintenance_expenses ENABLE ROW LEVEL SECURITY;
