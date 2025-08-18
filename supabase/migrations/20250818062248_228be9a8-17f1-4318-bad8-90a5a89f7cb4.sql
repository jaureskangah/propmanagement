-- Force update to pro status and bypass the check-subscription function
UPDATE subscribers 
SET 
  subscribed = true,
  subscription_tier = 'pro',
  subscription_end = now() + interval '1 year',
  updated_at = now()
WHERE user_id = '8d41b140-ebb4-4503-a7f2-3d26987051ca';