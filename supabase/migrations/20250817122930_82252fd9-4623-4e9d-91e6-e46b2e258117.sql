-- Check the current constraint on contact_messages status
SELECT con.conname, con.consrc 
FROM pg_constraint con 
JOIN pg_class rel ON rel.oid = con.conrelid 
WHERE rel.relname = 'contact_messages' AND con.contype = 'c';

-- Drop the existing constraint and create a new one that allows 'processed'
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_messages_status_check;

ALTER TABLE contact_messages ADD CONSTRAINT contact_messages_status_check 
CHECK (status IN ('pending', 'processed'));