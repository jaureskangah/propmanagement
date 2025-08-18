-- Update existing subscriber record to pro status
UPDATE subscribers 
SET 
  subscribed = true,
  subscription_tier = 'pro',
  subscription_end = now() + interval '1 year',
  updated_at = now()
WHERE email = 'jaureskangah2016@gmail.com';

-- Reset AI usage for today
DELETE FROM ai_usage_daily 
WHERE user_id = (SELECT auth.uid()) AND usage_date = CURRENT_DATE;