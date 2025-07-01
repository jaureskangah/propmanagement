
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const { tenantId, subject, content, category = 'general' } = await req.json()

    // Récupérer les informations du locataire
    const { data: tenant, error: tenantError } = await supabaseClient
      .from('tenants')
      .select('name, email')
      .eq('id', tenantId)
      .single()

    if (tenantError || !tenant) {
      throw new Error('Tenant not found')
    }

    // Envoyer l'email
    const { data, error } = await resend.emails.send({
      from: 'Gestion Immobilière <onboarding@resend.dev>',
      to: [tenant.email],
      subject: subject,
      html: content,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email' 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
