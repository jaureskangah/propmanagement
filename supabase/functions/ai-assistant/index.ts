import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client to get user context
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let contextData = '';
    
    if (userId) {
      // Get user's properties and financial data for context
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', userId);

      if (!propertiesError && properties) {
        const { data: payments } = await supabase
          .from('tenant_payments')
          .select('amount, status, due_date, created_at')
          .in('property_id', properties.map(p => p.id))
          .order('created_at', { ascending: false })
          .limit(10);

        const { data: expenses } = await supabase
          .from('maintenance_expenses')
          .select('amount, description, date, status')
          .in('property_id', properties.map(p => p.id))
          .order('date', { ascending: false })
          .limit(10);

        const totalRevenue = payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0;
        const totalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
        const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;

        contextData = `
Données financières de l'utilisateur:
- Nombre de propriétés: ${properties.length}
- Revenus totaux récents: ${totalRevenue}€
- Dépenses totales récentes: ${totalExpenses}€
- Paiements en attente: ${pendingPayments}
- Bénéfice net récent: ${totalRevenue - totalExpenses}€

Propriétés: ${properties.map(p => `${p.name} (${p.property_type}, ${p.city})`).join(', ')}
`;
      }
    }

    const systemPrompt = `Tu es un assistant IA spécialisé dans la gestion immobilière. Tu aides les propriétaires à gérer leurs biens, analyser leurs finances, et optimiser leurs investissements.

${contextData}

Instructions:
- Réponds en français
- Sois concis et pratique  
- Utilise les données financières ci-dessus pour donner des conseils personnalisés
- Propose des actions concrètes basées sur les données
- Si des données sont manquantes, demande des clarifications
- Formate tes réponses avec des listes à puces pour plus de clarté`;

    console.log('Sending request to OpenAI with context:', contextData);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});