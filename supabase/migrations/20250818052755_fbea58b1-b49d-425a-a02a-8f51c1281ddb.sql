-- Mettre à jour le statut d'abonnement pour l'utilisateur admin
UPDATE subscribers 
SET 
  subscribed = true,
  subscription_tier = 'pro',
  subscription_end = NOW() + INTERVAL '1 year'
WHERE user_id = '8d41b140-ebb4-4503-a7f2-3d26987051ca';