-- Security hardening: storage buckets and policies

-- 1) Make maintenance_photos bucket private
UPDATE storage.buckets
SET public = false
WHERE id = 'maintenance_photos';

-- 2) Storage policies for tenant_documents based on tenant ownership/profile
DROP POLICY IF EXISTS "Upload tenant docs under tenant folder" ON storage.objects;
DROP POLICY IF EXISTS "Read tenant docs for managed tenants" ON storage.objects;
DROP POLICY IF EXISTS "Update tenant docs for managed tenants" ON storage.objects;
DROP POLICY IF EXISTS "Delete tenant docs for managed tenants" ON storage.objects;

CREATE POLICY "Upload tenant docs under tenant folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'tenant_documents' AND
  EXISTS (
    SELECT 1 FROM public.tenants t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND (t.user_id = auth.uid() OR t.tenant_profile_id = auth.uid())
  )
);

CREATE POLICY "Read tenant docs for managed tenants"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'tenant_documents' AND
  EXISTS (
    SELECT 1 FROM public.tenants t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND (t.user_id = auth.uid() OR t.tenant_profile_id = auth.uid())
  )
);

CREATE POLICY "Update tenant docs for managed tenants"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'tenant_documents' AND
  EXISTS (
    SELECT 1 FROM public.tenants t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND (t.user_id = auth.uid() OR t.tenant_profile_id = auth.uid())
  )
)
WITH CHECK (
  bucket_id = 'tenant_documents' AND
  EXISTS (
    SELECT 1 FROM public.tenants t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND (t.user_id = auth.uid() OR t.tenant_profile_id = auth.uid())
  )
);

CREATE POLICY "Delete tenant docs for managed tenants"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'tenant_documents' AND
  EXISTS (
    SELECT 1 FROM public.tenants t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND (t.user_id = auth.uid() OR t.tenant_profile_id = auth.uid())
  )
);

-- 3) Storage policies for maintenance_photos requiring user-id prefix
DROP POLICY IF EXISTS "Upload own maintenance photos" ON storage.objects;
DROP POLICY IF EXISTS "Read own maintenance photos" ON storage.objects;
DROP POLICY IF EXISTS "Update own maintenance photos" ON storage.objects;
DROP POLICY IF EXISTS "Delete own maintenance photos" ON storage.objects;

CREATE POLICY "Upload own maintenance photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'maintenance_photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Read own maintenance photos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'maintenance_photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Update own maintenance photos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'maintenance_photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'maintenance_photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Delete own maintenance photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'maintenance_photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
