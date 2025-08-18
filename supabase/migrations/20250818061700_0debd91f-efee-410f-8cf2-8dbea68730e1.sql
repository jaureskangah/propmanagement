-- Create or update subscriber record for current user  
INSERT INTO subscribers (user_id, email, subscribed, subscription_tier, subscription_end, created_at, updated_at)
VALUES (
  (SELECT auth.uid()),
  (SELECT email FROM auth.users WHERE id = auth.uid()),
  true,
  'pro',
  now() + interval '1 year',
  now(),
  now()
);

-- Reset AI usage for today
DELETE FROM ai_usage_daily 
WHERE user_id = (SELECT auth.uid()) AND usage_date = CURRENT_DATE;