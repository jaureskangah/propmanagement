-- Fix subscription status and reset AI usage for current user
-- First, ensure a subscriber record exists
INSERT INTO subscribers (user_id, email, subscribed, subscription_tier, subscription_end, created_at, updated_at)
SELECT 
  auth.uid(),
  auth.email(),
  true,
  'pro',
  now() + interval '1 year',
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM subscribers 
  WHERE user_id = auth.uid() OR email = auth.email()
)
ON CONFLICT (user_id) DO UPDATE SET
  subscribed = true,
  subscription_tier = 'pro',
  subscription_end = now() + interval '1 year',
  updated_at = now();

-- Reset AI usage for today
DELETE FROM ai_usage_daily 
WHERE user_id = auth.uid() AND usage_date = CURRENT_DATE;