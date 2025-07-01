
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RentReminderRequest {
  manualTrigger?: boolean;
  tenantId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { manualTrigger = false, tenantId }: RentReminderRequest = 
      req.method === "POST" ? await req.json() : {};

    console.log("Processing rent payment reminders", { manualTrigger, tenantId });

    // Calculer le mois cible (le mois suivant)
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const targetMonthStr = targetMonth.toISOString().split('T')[0];

    // Construire la requête pour les locataires
    let tenantsQuery = supabase
      .from('tenants')
      .select(`
        id,
        name,
        email,
        rent_amount,
        disable_reminders,
        properties:property_id(name)
      `)
      .eq('disable_reminders', false);

    // Si rappel manuel pour un locataire spécifique
    if (manualTrigger && tenantId) {
      tenantsQuery = tenantsQuery.eq('id', tenantId);
    }

    const { data: tenants, error: tenantsError } = await tenantsQuery;

    if (tenantsError) {
      console.error("Error fetching tenants:", tenantsError);
      throw tenantsError;
    }

    console.log(`Found ${tenants?.length || 0} tenants to process`);

    const results = [];

    for (const tenant of tenants || []) {
      try {
        // Vérifier si un rappel a déjà été envoyé pour ce mois
        const { data: existingReminder } = await supabase
          .from('rent_payment_reminders')
          .select('id')
          .eq('tenant_id', tenant.id)
          .eq('target_month', targetMonthStr)
          .eq('reminder_type', '7_days')
          .single();

        if (existingReminder && !manualTrigger) {
          console.log(`Reminder already sent for tenant ${tenant.name}`);
          continue;
        }

        // Vérifier si un paiement existe déjà pour le mois cible
        const startOfTargetMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
        const endOfTargetMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
        
        const { data: existingPayment } = await supabase
          .from('tenant_payments')
          .select('id')
          .eq('tenant_id', tenant.id)
          .gte('payment_date', startOfTargetMonth.toISOString().split('T')[0])
          .lte('payment_date', endOfTargetMonth.toISOString().split('T')[0])
          .single();

        if (existingPayment && !manualTrigger) {
          console.log(`Payment already recorded for tenant ${tenant.name} for ${targetMonthStr}`);
          continue;
        }

        // Envoyer l'email de rappel
        const emailSent = await sendReminderEmail(tenant, targetMonth);

        // Enregistrer le rappel dans la base de données
        const { error: reminderError } = await supabase
          .from('rent_payment_reminders')
          .upsert({
            tenant_id: tenant.id,
            reminder_date: now.toISOString().split('T')[0],
            reminder_type: '7_days',
            target_month: targetMonthStr,
            status: emailSent ? 'sent' : 'failed',
            email_sent: emailSent
          });

        if (reminderError) {
          console.error(`Error saving reminder for tenant ${tenant.name}:`, reminderError);
        }

        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          email: tenant.email,
          success: emailSent,
          targetMonth: targetMonthStr
        });

      } catch (error) {
        console.error(`Error processing tenant ${tenant.name}:`, error);
        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          email: tenant.email,
          success: false,
          error: error.message
        });
      }
    }

    console.log("Reminder processing completed", { totalProcessed: results.length });

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in rent-payment-reminders function:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

async function sendReminderEmail(tenant: any, targetMonth: Date): Promise<boolean> {
  try {
    const monthNames = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    const targetMonthName = monthNames[targetMonth.getMonth()];
    const targetYear = targetMonth.getFullYear();
    const propertyName = tenant.properties?.name || 'votre logement';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Rappel de paiement de loyer</h2>
        
        <p>Bonjour ${tenant.name},</p>
        
        <p>Nous espérons que vous allez bien. Ceci est un rappel courtois concernant le paiement de votre loyer pour le mois de <strong>${targetMonthName} ${targetYear}</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #495057;">Détails du paiement</h3>
          <p><strong>Propriété :</strong> ${propertyName}</p>
          <p><strong>Montant du loyer :</strong> ${tenant.rent_amount}€</p>
          <p><strong>Date d'échéance :</strong> 1er ${targetMonthName} ${targetYear}</p>
        </div>
        
        <p>Si vous avez déjà effectué ce paiement, veuillez ignorer ce message. Dans le cas contraire, nous vous remercions de bien vouloir procéder au règlement avant la date d'échéance.</p>
        
        <p>Pour toute question ou information complémentaire, n'hésitez pas à nous contacter.</p>
        
        <p style="margin-top: 30px;">
          Cordialement,<br>
          <strong>Votre gestionnaire immobilier</strong>
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
        <p style="font-size: 12px; color: #6c757d;">
          Ce message est envoyé automatiquement. Si vous souhaitez ne plus recevoir ces rappels, veuillez contacter votre gestionnaire.
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Gestion Immobilière <noreply@resend.dev>",
      to: [tenant.email],
      subject: `Rappel de loyer - ${targetMonthName} ${targetYear}`,
      html: emailHtml,
    });

    console.log(`Email sent successfully to ${tenant.email}:`, emailResponse);
    return true;

  } catch (error) {
    console.error(`Failed to send email to ${tenant.email}:`, error);
    return false;
  }
}

serve(handler);
