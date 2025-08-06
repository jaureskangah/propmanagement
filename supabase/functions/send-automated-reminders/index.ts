import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AUTOMATED-REMINDERS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Initialize Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    const resend = new Resend(resendKey);
    logStep("Services initialized");

    // Get current date and calculate upcoming due dates
    const today = new Date();
    const in3Days = new Date(today);
    in3Days.setDate(today.getDate() + 3);
    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);
    const in30Days = new Date(today);
    in30Days.setDate(today.getDate() + 30);

    logStep("Date calculations completed", { today, in3Days, in7Days, in30Days });

    // Check for rent payment reminders (3 days before due)
    const { data: tenants, error: tenantsError } = await supabaseClient
      .from('tenants')
      .select(`
        id, name, email, rent_amount, rent_due_day,
        properties (name, id)
      `)
      .not('email', 'is', null);

    if (tenantsError) {
      throw new Error(`Failed to fetch tenants: ${tenantsError.message}`);
    }

    logStep("Fetched tenants", { count: tenants?.length });

    let remindersSent = 0;

    // Process rent payment reminders
    for (const tenant of tenants || []) {
      try {
        const rentDueDay = tenant.rent_due_day || 1;
        const nextRentDue = new Date(today.getFullYear(), today.getMonth(), rentDueDay);
        
        // If rent due day has passed this month, check next month
        if (nextRentDue <= today) {
          nextRentDue.setMonth(nextRentDue.getMonth() + 1);
        }

        // Check if reminder should be sent (3 days before)
        const reminderDate = new Date(nextRentDue);
        reminderDate.setDate(reminderDate.getDate() - 3);

        if (
          reminderDate.toDateString() === today.toDateString() &&
          tenant.email
        ) {
          logStep("Sending rent reminder", { 
            tenant: tenant.name, 
            email: tenant.email,
            dueDate: nextRentDue.toDateString()
          });

          const { error: emailError } = await resend.emails.send({
            from: 'notifications@propmanagement.app',
            to: [tenant.email],
            subject: `Rappel: Loyer à payer le ${nextRentDue.toLocaleDateString('fr-FR')}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Rappel de paiement de loyer</h2>
                <p>Bonjour ${tenant.name},</p>
                <p>Nous vous rappelons que votre loyer de <strong>${tenant.rent_amount}€</strong> pour le logement situé à <strong>${tenant.properties?.name}</strong> est dû le <strong>${nextRentDue.toLocaleDateString('fr-FR')}</strong>.</p>
                <p>Merci de procéder au paiement avant cette échéance.</p>
                <p>Cordialement,<br>L'équipe de gestion</p>
              </div>
            `
          });

          if (emailError) {
            logStep("Email error", { tenant: tenant.name, error: emailError });
          } else {
            remindersSent++;
            logStep("Rent reminder sent successfully", { tenant: tenant.name });
          }
        }
      } catch (error) {
        logStep("Error processing tenant reminder", { 
          tenant: tenant.name, 
          error: error.message 
        });
      }
    }

    // Check for lease expiry reminders (30 days before)
    const { data: expiringLeases, error: leasesError } = await supabaseClient
      .from('tenants')
      .select(`
        id, name, email, lease_end,
        properties (name)
      `)
      .not('email', 'is', null)
      .not('lease_end', 'is', null)
      .gte('lease_end', today.toISOString())
      .lte('lease_end', in30Days.toISOString());

    if (leasesError) {
      logStep("Error fetching expiring leases", { error: leasesError.message });
    } else {
      logStep("Fetched expiring leases", { count: expiringLeases?.length });

      for (const tenant of expiringLeases || []) {
        try {
          const leaseEndDate = new Date(tenant.lease_end);
          const reminderDate = new Date(leaseEndDate);
          reminderDate.setDate(reminderDate.getDate() - 30);

          if (reminderDate.toDateString() === today.toDateString()) {
            logStep("Sending lease expiry reminder", { 
              tenant: tenant.name,
              expiryDate: leaseEndDate.toDateString()
            });

            const { error: emailError } = await resend.emails.send({
              from: 'notifications@propmanagement.app',
              to: [tenant.email],
              subject: `Important: Expiration de votre bail dans 30 jours`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #333;">Expiration de bail</h2>
                  <p>Bonjour ${tenant.name},</p>
                  <p>Nous vous informons que votre bail pour le logement situé à <strong>${tenant.properties?.name}</strong> expire le <strong>${leaseEndDate.toLocaleDateString('fr-FR')}</strong>.</p>
                  <p>Merci de prendre contact avec nous pour discuter du renouvellement ou des modalités de sortie.</p>
                  <p>Cordialement,<br>L'équipe de gestion</p>
                </div>
              `
            });

            if (!emailError) {
              remindersSent++;
              logStep("Lease expiry reminder sent successfully", { tenant: tenant.name });
            }
          }
        } catch (error) {
          logStep("Error processing lease reminder", { 
            tenant: tenant.name, 
            error: error.message 
          });
        }
      }
    }

    logStep("Automated reminders completed", { 
      totalRemindersSent: remindersSent 
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        remindersSent,
        message: `${remindersSent} reminders sent successfully`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in automated reminders", { message: errorMessage });
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});