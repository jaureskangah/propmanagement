
-- Créer le bucket de stockage pour les documents des locataires s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('tenant_documents', 'tenant_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Créer une politique pour permettre l'upload de fichiers
CREATE POLICY "Allow authenticated users to upload tenant documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'tenant_documents' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre la lecture des documents
CREATE POLICY "Allow authenticated users to read tenant documents" ON storage.objects
FOR SELECT USING (bucket_id = 'tenant_documents' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre la suppression des documents
CREATE POLICY "Allow authenticated users to delete tenant documents" ON storage.objects
FOR DELETE USING (bucket_id = 'tenant_documents' AND auth.role() = 'authenticated');
