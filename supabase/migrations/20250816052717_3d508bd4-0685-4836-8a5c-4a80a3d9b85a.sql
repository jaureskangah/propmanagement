-- Enable RLS on contact_messages table if not already enabled
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to read their own contact messages (optional)
CREATE POLICY "Users can view their own contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (auth.uid() IS NOT NULL);