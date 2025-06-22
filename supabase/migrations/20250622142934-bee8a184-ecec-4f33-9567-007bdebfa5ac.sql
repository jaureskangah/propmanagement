
-- Supprimer la politique RLS défectueuse existante pour l'insertion
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.maintenance_expenses;

-- Créer uniquement la nouvelle politique RLS pour l'insertion qui permet aux utilisateurs
-- d'insérer des dépenses pour leurs propres propriétés ou des dépenses générales
CREATE POLICY "Users can insert their own maintenance expenses" 
  ON public.maintenance_expenses 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND (
      property_id IS NULL OR 
      property_id IN (
        SELECT id FROM public.properties WHERE user_id = auth.uid()
      )
    )
  );

-- S'assurer que RLS est activé sur la table
ALTER TABLE public.maintenance_expenses ENABLE ROW LEVEL SECURITY;
