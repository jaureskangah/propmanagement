-- Corriger le statut de l'invitation pour Kangah Mael qui s'est déjà inscrit
UPDATE tenant_invitations 
SET status = 'accepted'
WHERE id = '880c705c-15f1-4166-8da9-458ccfdbd23b' 
AND email = 'jaures.kangah@akwabacommunity.com'
AND status = 'pending';