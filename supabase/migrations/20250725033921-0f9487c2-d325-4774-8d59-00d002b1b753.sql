-- Fix remaining RLS issues
-- Enable RLS on vendor_documents table that has policies but RLS disabled
ALTER TABLE vendor_documents ENABLE ROW LEVEL SECURITY;