-- Security hardening migration: storage buckets privacy and object-level RLS
-- 1) Make vendor_files bucket private
update storage.buckets set public = false where id = 'vendor_files';

-- 2) STORAGE RLS: enforce user-scoped folder prefixes for private buckets
-- Helper note: We restrict access so the first folder of the object path must equal auth.uid()

-- tenant_documents policies
DROP POLICY IF EXISTS "tenant_documents_select_owner_folder" ON storage.objects;
CREATE POLICY "tenant_documents_select_owner_folder"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'tenant_documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "tenant_documents_insert_owner_folder" ON storage.objects;
CREATE POLICY "tenant_documents_insert_owner_folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'tenant_documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "tenant_documents_update_owner_folder" ON storage.objects;
CREATE POLICY "tenant_documents_update_owner_folder"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'tenant_documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'tenant_documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "tenant_documents_delete_owner_folder" ON storage.objects;
CREATE POLICY "tenant_documents_delete_owner_folder"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'tenant_documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- maintenance_photos policies
DROP POLICY IF EXISTS "maintenance_photos_select_owner_folder" ON storage.objects;
CREATE POLICY "maintenance_photos_select_owner_folder"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'maintenance_photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "maintenance_photos_insert_owner_folder" ON storage.objects;
CREATE POLICY "maintenance_photos_insert_owner_folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'maintenance_photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "maintenance_photos_update_owner_folder" ON storage.objects;
CREATE POLICY "maintenance_photos_update_owner_folder"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'maintenance_photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'maintenance_photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "maintenance_photos_delete_owner_folder" ON storage.objects;
CREATE POLICY "maintenance_photos_delete_owner_folder"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'maintenance_photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- vendor_files policies
DROP POLICY IF EXISTS "vendor_files_select_owner_folder" ON storage.objects;
CREATE POLICY "vendor_files_select_owner_folder"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'vendor_files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "vendor_files_insert_owner_folder" ON storage.objects;
CREATE POLICY "vendor_files_insert_owner_folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'vendor_files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "vendor_files_update_owner_folder" ON storage.objects;
CREATE POLICY "vendor_files_update_owner_folder"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'vendor_files'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'vendor_files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "vendor_files_delete_owner_folder" ON storage.objects;
CREATE POLICY "vendor_files_delete_owner_folder"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'vendor_files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
