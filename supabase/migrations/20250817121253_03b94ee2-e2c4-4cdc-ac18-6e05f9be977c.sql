-- Add RLS policy to allow admins to update contact messages
CREATE POLICY "Admins can update contact messages" 
ON contact_messages 
FOR UPDATE 
USING (has_role('admin'::app_role));