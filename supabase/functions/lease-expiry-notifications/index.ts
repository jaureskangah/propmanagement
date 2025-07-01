
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

// Enhanced logging function
function logInfo(message: string, data?: any) {
  console.log(`[LEASE-NOTIFICATIONS] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

function logError(message: string, error?: any) {
  console.error(`[LEASE-NOTIFICATIONS ERROR] ${message}`, error);
}

// Retry mechanism for email sending
async function sendEmailWithRetry(emailData: any, maxRetries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logInfo(`Attempting to send email (attempt ${attempt}/${maxRetries})`, {
        to: emailData.to,
        subject: emailData.subject
      });

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailData),
      });

      if (res.ok) {
        const result = await res.json();
        logInfo("Email sent successfully", result);
        return true;
      } else {
        const errorText = await res.text();
        logError(`Email sending failed (attempt ${attempt})`, {
          status: res.status,
          statusText: res.statusText,
          error: errorText
        });
        
        if (attempt === maxRetries) {
          throw new Error(`Failed to send email after ${maxRetries} attempts: ${errorText}`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    } catch (error) {
      logError(`Email sending attempt ${attempt} failed`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  return false;
}

async function sendLeaseExpiryEmail(
  landlordEmail: string,
  tenantName: string,
  leaseEndDate: string,
  daysUntilExpiry: number,
  propertyName?: string
) {
  const subject = daysUntilExpiry > 0 
    ? `Rappel d'expiration de bail : ${tenantName} (${daysUntilExpiry} jours restants)`
    : `Bail expiré : ${tenantName} (expiré depuis ${Math.abs(daysUntilExpiry)} jours)`;

  const emailData = {
    from: "Gestionnaire Immobilier <onboarding@resend.dev>",
    to: [landlordEmail],
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
          ${daysUntilExpiry > 0 ? '⏰ Rappel d\'expiration de bail' : '🚨 Bail expiré'}
        </h2>
        
        <div style="background-color: ${daysUntilExpiry > 0 ? '#fff3cd' : '#f8d7da'}; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: ${daysUntilExpiry > 0 ? '#856404' : '#721c24'};">
            ${daysUntilExpiry > 0 
              ? `Le bail de ${tenantName} expire dans ${daysUntilExpiry} jour(s)`
              : `Le bail de ${tenantName} a expiré depuis ${Math.abs(daysUntilExpiry)} jour(s)`
            }
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #495057;">Détails du bail</h3>
          <ul style="color: #6c757d; line-height: 1.6;">
            <li><strong>Locataire :</strong> ${tenantName}</li>
            ${propertyName ? `<li><strong>Propriété :</strong> ${propertyName}</li>` : ''}
            <li><strong>Date de fin du bail :</strong> ${new Date(leaseEndDate).toLocaleDateString('fr-FR')}</li>
            <li><strong>Statut :</strong> ${daysUntilExpiry > 0 ? `Expire dans ${daysUntilExpiry} jour(s)` : `Expiré depuis ${Math.abs(daysUntilExpiry)} jour(s)`}</li>
          </ul>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #0c5aa6;">Actions recommandées :</h4>
          <ul style="color: #495057; line-height: 1.6;">
            ${daysUntilExpiry > 0 
              ? `
                <li>Contactez le locataire pour discuter du renouvellement</li>
                <li>Préparez les documents de renouvellement si nécessaire</li>
                <li>Planifiez une inspection de l'état des lieux</li>
              `
              : `
                <li>Contactez immédiatement le locataire</li>
                <li>Vérifiez les conditions de sortie du bail</li>
                <li>Planifiez l'état des lieux de sortie</li>
                <li>Préparez les démarches de restitution de caution</li>
              `
            }
          </ul>
        </div>

        <p style="color: #6c757d; font-size: 12px; margin-top: 30px;">
          Cet email a été envoyé automatiquement par votre système de gestion immobilière.
          <br>
          Pour désactiver ces notifications, connectez-vous à votre tableau de bord.
        </p>
      </div>
    `,
  };

  return await sendEmailWithRetry(emailData);
}

async function checkLeaseExpirations() {
  logInfo("Starting lease expiration check");
  
  // Check if required environment variables are set
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are not properly configured");
  }

  try {
    logInfo("Fetching tenants with lease information");
    
    const { data: tenants, error } = await supabase
      .from("tenants")
      .select(`
        id,
        name,
        email,
        lease_end,
        lease_start,
        user_id,
        property_id,
        properties (
          name,
          address
        ),
        profiles (
          id,
          first_name,
          last_name,
          email
        )
      `);

    if (error) {
      logError("Error fetching tenants", error);
      throw error;
    }

    logInfo(`Found ${tenants?.length || 0} tenants to check`);

    if (!tenants || tenants.length === 0) {
      logInfo("No tenants found, exiting");
      return;
    }

    const today = new Date();
    const notificationThresholds = [90, 60, 30, 15, 7, 1]; // Days before expiry for reminders
    let emailsSent = 0;
    let errorsOccurred = 0;

    for (const tenant of tenants) {
      try {
        if (!tenant.lease_end) {
          logInfo(`Skipping tenant ${tenant.name} - no lease end date`);
          continue;
        }

        const leaseEndDate = new Date(tenant.lease_end);
        const daysUntilExpiry = Math.ceil(
          (leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        logInfo(`Checking tenant ${tenant.name}`, {
          leaseEndDate: tenant.lease_end,
          daysUntilExpiry,
          thresholds: notificationThresholds
        });

        // Check if we should send a notification
        let shouldSendNotification = false;
        
        if (daysUntilExpiry < 0) {
          // Lease has expired - send notification daily for first week, then weekly
          const daysExpired = Math.abs(daysUntilExpiry);
          shouldSendNotification = daysExpired <= 7 || (daysExpired % 7 === 0 && daysExpired <= 30);
        } else if (notificationThresholds.includes(daysUntilExpiry)) {
          // Lease is expiring soon
          shouldSendNotification = true;
        }

        if (shouldSendNotification) {
          logInfo(`Sending notification for tenant ${tenant.name}`, {
            daysUntilExpiry,
            expired: daysUntilExpiry < 0
          });

          // Get landlord email (property owner)
          const { data: userData, error: userError } = await supabase
            .auth.admin.getUserById(tenant.user_id);

          if (userError) {
            logError(`Error fetching user data for tenant ${tenant.name}`, userError);
            errorsOccurred++;
            continue;
          }

          const landlordEmail = userData?.user?.email;
          if (!landlordEmail) {
            logError(`No email found for tenant ${tenant.name}'s landlord`);
            errorsOccurred++;
            continue;
          }

          const propertyName = tenant.properties?.name || 'Propriété non spécifiée';
          
          const emailSent = await sendLeaseExpiryEmail(
            landlordEmail,
            tenant.name,
            tenant.lease_end,
            daysUntilExpiry,
            propertyName
          );

          if (emailSent) {
            emailsSent++;
            logInfo(`Successfully sent notification for tenant ${tenant.name}`);
          } else {
            errorsOccurred++;
            logError(`Failed to send notification for tenant ${tenant.name}`);
          }

          // Add delay between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          logInfo(`No notification needed for tenant ${tenant.name}`);
        }
      } catch (error) {
        logError(`Error processing tenant ${tenant.name}`, error);
        errorsOccurred++;
      }
    }

    logInfo("Lease expiration check completed", {
      totalTenants: tenants.length,
      emailsSent,
      errorsOccurred
    });

    return {
      totalTenants: tenants.length,
      emailsSent,
      errorsOccurred
    };
  } catch (error) {
    logError("Fatal error in checkLeaseExpirations", error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  logInfo("Lease expiry notification function invoked", {
    method: req.method,
    url: req.url
  });

  try {
    const result = await checkLeaseExpirations();
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Lease expiry checks completed successfully",
        ...result
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    logError("Error in lease expiry checks", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
