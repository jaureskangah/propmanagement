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

async function sendLeaseExpiryEmail(
  landlordEmail: string,
  tenantName: string,
  leaseEndDate: string,
  daysUntilExpiry: number
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Property Manager <onboarding@resend.dev>",
      to: [landlordEmail],
      subject: `Lease Expiry Reminder: ${tenantName}'s lease expires in ${daysUntilExpiry} days`,
      html: `
        <h2>Lease Expiry Reminder</h2>
        <p>This is a reminder that the lease for tenant ${tenantName} will expire on ${leaseEndDate} (in ${daysUntilExpiry} days).</p>
        <p>Please take appropriate action regarding lease renewal or tenant transition.</p>
      `,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to send email: ${await res.text()}`);
  }

  return await res.json();
}

async function checkLeaseExpirations() {
  console.log("Checking lease expirations...");
  
  const { data: tenants, error } = await supabase
    .from("tenants")
    .select(`
      id,
      name,
      lease_end,
      user_id,
      profiles (
        id,
        first_name,
        last_name
      )
    `);

  if (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }

  const today = new Date();
  const notificationThresholds = [90, 60, 30, 15, 7]; // Jours avant expiration pour envoyer des rappels

  for (const tenant of tenants) {
    const leaseEndDate = new Date(tenant.lease_end);
    const daysUntilExpiry = Math.ceil(
      (leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Vérifier si nous devons envoyer une notification pour ce seuil
    if (notificationThresholds.includes(daysUntilExpiry)) {
      try {
        // Récupérer l'email du propriétaire
        const { data: userData, error: userError } = await supabase
          .auth.admin.getUserById(tenant.user_id);

        if (userError) {
          console.error("Error fetching user:", userError);
          continue;
        }

        if (userData?.user?.email) {
          await sendLeaseExpiryEmail(
            userData.user.email,
            tenant.name,
            tenant.lease_end,
            daysUntilExpiry
          );
          console.log(`Sent notification for tenant ${tenant.name}`);
        }
      } catch (error) {
        console.error(`Error sending notification for tenant ${tenant.name}:`, error);
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await checkLeaseExpirations();
    return new Response(
      JSON.stringify({ message: "Lease expiry checks completed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in lease expiry checks:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});