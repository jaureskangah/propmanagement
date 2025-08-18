-- Restore Premium subscription status for current user
UPDATE subscribers 
SET 
  subscribed = true,
  subscription_tier = 'pro',
  subscription_end = now() + interval '1 year',
  updated_at = now()
WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR user_id = auth.uid();