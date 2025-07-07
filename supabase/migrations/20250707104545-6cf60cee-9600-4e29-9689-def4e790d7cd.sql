
-- Créer une fonction qui calcule la note moyenne d'un prestataire
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Créer les triggers pour mettre à jour la note automatiquement
DROP TRIGGER IF EXISTS trigger_update_vendor_rating_insert ON vendor_reviews;
DROP TRIGGER IF EXISTS trigger_update_vendor_rating_update ON vendor_reviews;
DROP TRIGGER IF EXISTS trigger_update_vendor_rating_delete ON vendor_reviews;

CREATE TRIGGER trigger_update_vendor_rating_insert
  AFTER INSERT ON vendor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_rating();

CREATE TRIGGER trigger_update_vendor_rating_update
  AFTER UPDATE ON vendor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_rating();

CREATE TRIGGER trigger_update_vendor_rating_delete
  AFTER DELETE ON vendor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_rating();

-- Mettre à jour toutes les notes existantes pour s'assurer qu'elles sont correctes
UPDATE vendors 
SET rating = (
  SELECT COALESCE(AVG(rating), 0)
  FROM vendor_reviews 
  WHERE vendor_id = vendors.id
);
