
-- Supprimer tous les utilisateurs et données associées pour un test propre
-- Suppression dans l'ordre correct pour éviter les violations de contraintes de clés étrangères

-- 1. Supprimer d'abord les données qui dépendent d'autres tables
DELETE FROM tenant_invitations;
DELETE FROM tenant_communications;
DELETE FROM tenant_documents;
DELETE FROM tenant_payments;
DELETE FROM maintenance_requests;
DELETE FROM maintenance_tasks;
DELETE FROM maintenance_expenses;
DELETE FROM maintenance_budgets;
DELETE FROM vendor_documents;
DELETE FROM vendor_interventions;
DELETE FROM vendor_reviews;
DELETE FROM vendors;
DELETE FROM document_history;
DELETE FROM document_templates;
DELETE FROM dashboard_preferences;
DELETE FROM user_roles;

-- 2. Supprimer les locataires (qui référencent les propriétés)
DELETE FROM tenants;

-- 3. Supprimer les propriétés (qui référencent les profils via user_id)
DELETE FROM properties;

-- 4. Enfin supprimer les profils
DELETE FROM profiles;
