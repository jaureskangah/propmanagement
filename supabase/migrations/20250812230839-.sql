-- Security hardening migration
-- 1) Make tenant_documents bucket private
update storage.buckets set public = false where id = 'tenant_documents';

-- 2) Storage policies for tenant_documents (private bucket)
-- Clean up any permissive/public policies if they exist
drop policy if exists "Public read access for tenant_documents" on storage.objects;
drop policy if exists "Public uploads to tenant_documents" on storage.objects;

do $$ begin
  perform 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated users can read tenant_documents';
  if found then
    execute 'drop policy "Authenticated users can read tenant_documents" on storage.objects';
  end if;
end $$;

do $$ begin
  perform 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated users can upload tenant_documents';
  if found then
    execute 'drop policy "Authenticated users can upload tenant_documents" on storage.objects';
  end if;
end $$;

do $$ begin
  perform 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated users can delete tenant_documents';
  if found then
    execute 'drop policy "Authenticated users can delete tenant_documents" on storage.objects';
  end if;
end $$;

do $$ begin
  perform 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated users can update tenant_documents';
  if found then
    execute 'drop policy "Authenticated users can update tenant_documents" on storage.objects';
  end if;
end $$;

-- Ensure RLS is enabled on storage.objects (it is by default, but safe to assert)
alter table storage.objects enable row level security;

-- Restrict access to authenticated users only within this bucket
create policy "Authenticated users can read tenant_documents"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'tenant_documents');

create policy "Authenticated users can upload tenant_documents"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'tenant_documents');

create policy "Authenticated users can delete tenant_documents"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'tenant_documents');

create policy "Authenticated users can update tenant_documents"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'tenant_documents')
  with check (bucket_id = 'tenant_documents');

-- 3) Remove permissive tenants invitation-view policy
drop policy if exists "Allow tenant access during valid invitation process" on public.tenants;
