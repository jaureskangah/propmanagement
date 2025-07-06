
-- Phase 1: Ajouter les colonnes manquantes pour les rappels à la table maintenance_tasks
-- Ces colonnes sont optionnelles avec des valeurs par défaut pour ne pas casser les données existantes

ALTER TABLE maintenance_tasks 
ADD COLUMN has_reminder BOOLEAN DEFAULT false,
ADD COLUMN reminder_date DATE,
ADD COLUMN reminder_method TEXT DEFAULT 'app';

-- Ajouter des contraintes pour s'assurer de la cohérence des données
ALTER TABLE maintenance_tasks 
ADD CONSTRAINT check_reminder_method 
CHECK (reminder_method IN ('app', 'email', 'both'));

-- Ajouter un index pour améliorer les performances des requêtes sur les rappels
CREATE INDEX idx_maintenance_tasks_reminder ON maintenance_tasks(has_reminder, reminder_date) 
WHERE has_reminder = true;
