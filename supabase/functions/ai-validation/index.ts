import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dataConsistency: {
    propertyCount: boolean;
    financialData: boolean;
    contextMatch: boolean;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { aiResponse, contextData, userId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`[AI-VALIDATION] Validating response for user: ${userId}`);

    const validation: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      dataConsistency: {
        propertyCount: true,
        financialData: true,
        contextMatch: true
      }
    };

    // 1. Validation du nombre de propriétés
    const propertyCountMatch = contextData.match(/Nombre de propriétés:\s*(\d+)/);
    const actualPropertyCount = propertyCountMatch ? parseInt(propertyCountMatch[1]) : null;
    
    if (actualPropertyCount !== null) {
      // Chercher dans la réponse AI des mentions de nombres de propriétés différents
      const aiPropertyCounts = aiResponse.match(/(\d+)\s*(propriété|property)/gi);
      
      if (aiPropertyCounts) {
        for (const match of aiPropertyCounts) {
          const mentionedCount = parseInt(match.match(/\d+/)[0]);
          if (mentionedCount !== actualPropertyCount) {
            validation.errors.push(
              `HALLUCINATION DÉTECTÉE: AI mentionne ${mentionedCount} propriétés mais l'utilisateur en a ${actualPropertyCount}`
            );
            validation.isValid = false;
            validation.dataConsistency.propertyCount = false;
          }
        }
      }
    }

    // 2. Validation des données financières
    if (actualPropertyCount === 0) {
      // Si 0 propriétés, vérifier qu'aucune donnée financière n'est inventée
      const financialPatterns = [
        /revenus?\s*:\s*[\d,]+/gi,
        /loyer\s*:\s*[\d,]+/gi,
        /cash.?flow\s*:\s*[\d,]+/gi,
        /bénéfice\s*:\s*[\d,]+/gi
      ];

      for (const pattern of financialPatterns) {
        if (pattern.test(aiResponse) && !contextData.includes('ERREUR')) {
          validation.warnings.push(
            'ATTENTION: Données financières mentionnées pour un utilisateur sans propriétés'
          );
          validation.dataConsistency.financialData = false;
        }
      }
    }

    // 3. Validation de la cohérence contextuelle
    if (!aiResponse.includes('Je n\'ai pas cette information') && 
        contextData.includes('Nombre de propriétés: 0') && 
        !aiResponse.includes('sans propriétés')) {
      validation.warnings.push(
        'INCOHÉRENCE: Réponse ne reflète pas le statut "aucune propriété"'
      );
      validation.dataConsistency.contextMatch = false;
    }

    // 4. Vérification contre les données réelles en base
    if (userId) {
      const { data: realProperties } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId);

      const realCount = realProperties?.length || 0;
      
      if (actualPropertyCount !== realCount) {
        validation.errors.push(
          `ERREUR CONTEXTE: Contexte indique ${actualPropertyCount} propriétés mais BDD en a ${realCount}`
        );
        validation.isValid = false;
      }
    }

    // Log des résultats
    if (!validation.isValid) {
      console.error('[AI-VALIDATION] VALIDATION ÉCHOUÉE:', validation.errors);
    }
    
    if (validation.warnings.length > 0) {
      console.warn('[AI-VALIDATION] AVERTISSEMENTS:', validation.warnings);
    }

    // Enregistrer les problèmes de validation pour monitoring
    if (!validation.isValid || validation.warnings.length > 0) {
      await supabase
        .from('ai_validation_logs')
        .insert({
          user_id: userId,
          validation_result: validation,
          ai_response: aiResponse.substring(0, 1000), // Truncate pour éviter les gros logs
          context_data: contextData.substring(0, 1000),
          created_at: new Date().toISOString()
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        validation
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in ai-validation function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});