-- Ajouter les nouveaux champs pour les adresses canadiennes aux propriétés existantes
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Ajouter des index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_properties_province ON properties(province);
CREATE INDEX IF NOT EXISTS idx_properties_postal_code ON properties(postal_code);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);