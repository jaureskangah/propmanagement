
-- Ajouter une colonne pour désactiver les rappels dans la table tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS disable_reminders boolean DEFAULT false;

-- Créer la table pour tracker les rappels de paiement
CREATE TABLE IF NOT EXISTS rent_payment_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  reminder_date date NOT NULL,
  reminder_type text NOT NULL DEFAULT '7_days',
  target_month date NOT NULL, -- Le mois pour lequel le rappel est envoyé (ex: 2024-02-01 pour février)
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'sent',
  email_sent boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_rent_payment_reminders_tenant_id ON rent_payment_reminders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rent_payment_reminders_reminder_date ON rent_payment_reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_rent_payment_reminders_target_month ON rent_payment_reminders(target_month);

-- Contrainte pour éviter les doublons de rappels pour le même mois
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_reminder_per_tenant_month 
ON rent_payment_reminders(tenant_id, target_month, reminder_type);
