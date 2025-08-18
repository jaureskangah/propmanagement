import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';
import documentation from './documentation.json' assert { type: 'json' };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client at the beginning
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { message, userId, language = 'fr' } = await req.json();
    
    // Vérifier les limites d'utilisation d'abord
    if (userId) {
      // Vérifier d'abord si l'utilisateur est admin
      const { data: adminRole, error: adminError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      const isAdmin = !!adminRole;
      console.log('Admin check:', { isAdmin, adminError, userId, adminRole });

      let maxMessages = 3; // Default pour les utilisateurs gratuits
      let subscription = null; // Initialiser pour tous les utilisateurs

      if (isAdmin) {
        maxMessages = Infinity;
        subscription = { subscription_tier: 'admin', subscribed: true }; // Valeur fictive pour admin
        console.log('User is admin - unlimited messages granted');
      } else {
        // Récupérer les informations d'abonnement pour les non-admins
        const { data: subscriptionData } = await supabase
          .from('subscribers')
          .select('subscription_tier, subscribed')
          .eq('user_id', userId)
          .single();

        subscription = subscriptionData;
        console.log('User subscription retrieved:', subscription?.subscription_tier || 'free');

        // Déterminer les limites selon l'abonnement
        maxMessages = (!subscription || !subscription.subscribed || subscription.subscription_tier === 'free') ? 3 : Infinity;
      }
      
      if (maxMessages !== Infinity) {
        // Vérifier l'utilisation actuelle
        const today = new Date().toISOString().split('T')[0];
        const { data: todayUsage } = await supabase
          .from('ai_usage_daily')
          .select('message_count')
          .eq('user_id', userId)
          .eq('usage_date', today)
          .single();

        const currentUsage = todayUsage?.message_count || 0;
        
        if (currentUsage >= maxMessages) {
          return new Response(
            JSON.stringify({ 
              error: 'Limite quotidienne atteinte',
              message: 'Vous avez atteint votre limite quotidienne de messages IA. Passez au Premium pour un accès illimité.'
            }),
            { 
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }
    }
    
    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }


    let contextData = '';
    
    if (userId) {
      // Get user's properties and comprehensive financial data
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId);

      if (!propertiesError && properties && properties.length > 0) {
        const propertyIds = properties.map(p => p.id);
        
        // Get comprehensive financial data
        const [
          { data: payments },
          { data: expenses },
          { data: tenants },
          { data: vendorInterventions },
          { data: maintenanceRequests }
        ] = await Promise.all([
          supabase
            .from('tenant_payments')
            .select('amount, status, payment_date, tenant_id, tenants!inner(property_id)')
            .in('tenants.property_id', propertyIds)
            .gte('payment_date', new Date(new Date().getFullYear() - 1, 0, 1).toISOString())
            .order('payment_date', { ascending: false }),
          
          supabase
            .from('maintenance_expenses')
            .select('amount, description, date, category, property_id')
            .in('property_id', propertyIds)
            .gte('date', new Date(new Date().getFullYear() - 1, 0, 1).toISOString())
            .order('date', { ascending: false }),
            
          supabase
            .from('tenants')
            .select('id, name, rent_amount, lease_start, lease_end, property_id')
            .in('property_id', propertyIds),
            
          supabase
            .from('vendor_interventions')
            .select('cost, date, description, status, property_id')
            .in('property_id', propertyIds)
            .gte('date', new Date(new Date().getFullYear() - 1, 0, 1).toISOString())
            .order('date', { ascending: false }),
            
          supabase
            .from('maintenance_requests')
            .select('status, priority, created_at, title, tenant_id')
            .order('created_at', { ascending: false })
            .limit(20)
        ]);

        // Financial Calculations
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        
        // Revenue calculations
        const totalRevenue = payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        const monthlyRevenue = payments?.filter(p => {
          const paymentDate = new Date(p.payment_date);
          return p.status === 'paid' && 
                 paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        }).reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        
        // Expense calculations
        const maintenanceExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
        const vendorCosts = vendorInterventions?.reduce((sum, v) => sum + Number(v.cost || 0), 0) || 0;
        const totalExpenses = maintenanceExpenses + vendorCosts;
        
        // Occupancy calculations
        const totalUnits = properties.reduce((sum, p) => sum + (p.units || 0), 0);
        const occupiedUnits = tenants?.length || 0;
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
        
        // Cash flow analysis
        const netIncome = totalRevenue - totalExpenses;
        const monthlyExpenses = expenses?.filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        }).reduce((sum, e) => sum + Number(e.amount), 0) || 0;
        const monthlyCashFlow = monthlyRevenue - monthlyExpenses;
        
        // Unpaid rent calculation
        const unpaidRent = tenants?.reduce((total, tenant) => {
          const expectedRent = Number(tenant.rent_amount) || 0;
          const tenantPayments = payments?.filter(p => 
            p.tenant_id === tenant.id && 
            p.status === 'paid' &&
            new Date(p.payment_date).getMonth() === currentMonth &&
            new Date(p.payment_date).getFullYear() === currentYear
          ).reduce((sum, p) => sum + Number(p.amount), 0) || 0;
          
          return total + Math.max(0, expectedRent - tenantPayments);
        }, 0) || 0;
        
        // Maintenance analysis
        const pendingRequests = maintenanceRequests?.filter(r => r.status === 'Pending').length || 0;
        const urgentRequests = maintenanceRequests?.filter(r => r.priority === 'Urgent' || r.priority === 'High').length || 0;
        
        // Expense breakdown by category
        const expenseCategories: Record<string, number> = {};
        expenses?.forEach(e => {
          const category = e.category || 'Autres';
          expenseCategories[category] = (expenseCategories[category] || 0) + Number(e.amount);
        });
        
        // Performance metrics
        const averageRentPerUnit = totalUnits > 0 ? (tenants?.reduce((sum, t) => sum + Number(t.rent_amount || 0), 0) || 0) / totalUnits : 0;
        const expenseRatio = totalRevenue > 0 ? Math.round((totalExpenses / totalRevenue) * 100) : 0;
        
        // Sort properties by creation date to identify most recent
        const sortedProperties = properties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const mostRecentProperty = sortedProperties[0];
        const oldestProperty = sortedProperties[sortedProperties.length - 1];
        
        // Format property details with dates
        const propertyDetails = sortedProperties.map(p => {
          const createdDate = new Date(p.created_at);
          const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
          const propertyTenants = tenants?.filter(t => t.property_id === p.id) || [];
          
          return {
            name: p.name,
            type: p.type,
            units: p.units,
            address: p.address,
            city: p.city,
            province: p.province,
            created_date: createdDate.toLocaleDateString('fr-FR'),
            days_since_acquired: daysSinceCreated,
            rent_amount: p.rent_amount,
            tenant_count: propertyTenants.length,
            occupancy_rate: p.units > 0 ? Math.round((propertyTenants.length / p.units) * 100) : 0
          };
        });
        
        // Generate intelligent insights
        const insights = [];
        
        if (occupancyRate < 85) {
          insights.push(`⚠️ Taux d'occupation faible (${occupancyRate}%) - Considérez améliorer le marketing ou réduire les loyers`);
        }
        
        if (expenseRatio > 40) {
          insights.push(`💸 Ratio dépenses élevé (${expenseRatio}%) - Analysez les postes de coûts majeurs`);
        }
        
        if (unpaidRent > 0) {
          insights.push(`🔴 Loyers impayés de ${unpaidRent.toLocaleString('fr-CA')}$ CAD - Actions de recouvrement nécessaires`);
        }
        
        if (urgentRequests > 0) {
          insights.push(`🚨 ${urgentRequests} demandes de maintenance urgentes à traiter`);
        }
        
        if (monthlyCashFlow < 0) {
          insights.push(`📉 Cash-flow mensuel négatif (${monthlyCashFlow.toLocaleString('fr-CA')}$ CAD) - Révision budgétaire recommandée`);
        }
        
        if (netIncome > 0) {
          const roi = Math.round((netIncome / (totalRevenue || 1)) * 100);
          if (roi > 15) {
            insights.push(`✅ Excellente rentabilité (${roi}%) - Portfolio performant`);
          } else if (roi < 5) {
            insights.push(`📊 Rentabilité faible (${roi}%) - Optimisation nécessaire`);
          }
        }

        contextData = `
ANALYSE FINANCIÈRE DÉTAILLÉE:

📊 REVENUS ET PERFORMANCE:
- Revenus totaux (12 mois): ${totalRevenue.toLocaleString('fr-CA')}$ CAD
- Revenus ce mois: ${monthlyRevenue.toLocaleString('fr-CA')}$ CAD
- Loyer moyen par unité: ${Math.round(averageRentPerUnit).toLocaleString('fr-CA')}$ CAD
- Loyers impayés: ${unpaidRent.toLocaleString('fr-CA')}$ CAD

💰 DÉPENSES ET COÛTS:
- Dépenses totales (12 mois): ${totalExpenses.toLocaleString('fr-CA')}$ CAD
- Dépenses maintenance: ${maintenanceExpenses.toLocaleString('fr-CA')}$ CAD
- Interventions prestataires: ${vendorCosts.toLocaleString('fr-CA')}$ CAD
- Ratio dépenses/revenus: ${expenseRatio}%

🏠 PATRIMOINE IMMOBILIER (par ordre d'acquisition):
${propertyDetails.map((p, index) => `
${index + 1}. **${p.name}** (${p.type})
   - Adresse: ${p.address}${p.city ? `, ${p.city}` : ''}${p.province ? `, ${p.province}` : ''}
   - Acquise le: ${p.created_date} (il y a ${p.days_since_acquired} jours)
   - Unités: ${p.units} | Locataires: ${p.tenant_count} | Taux d'occupation: ${p.occupancy_rate}%
   - Loyer: ${p.rent_amount?.toLocaleString('fr-CA') || 'N/A'}$ CAD`).join('')}

📋 RÉSUMÉ PATRIMOINE:
- Nombre de propriétés: ${properties.length}
- Propriété la plus récente: ${mostRecentProperty.name} (${new Date(mostRecentProperty.created_at).toLocaleDateString('fr-FR')})
- Propriété la plus ancienne: ${oldestProperty.name} (${new Date(oldestProperty.created_at).toLocaleDateString('fr-FR')})
- Unités totales: ${totalUnits}
- Unités occupées: ${occupiedUnits}
- Taux d'occupation global: ${occupancyRate}%
- Locataires actifs: ${tenants?.length || 0}

📈 ANALYSE CASH-FLOW:
- Bénéfice net (12 mois): ${netIncome.toLocaleString('fr-CA')}$ CAD
- Cash-flow mensuel: ${monthlyCashFlow.toLocaleString('fr-CA')}$ CAD
- Rentabilité: ${totalRevenue > 0 ? Math.round((netIncome / totalRevenue) * 100) : 0}%

🔧 MAINTENANCE:
- Demandes en attente: ${pendingRequests}
- Demandes urgentes: ${urgentRequests}
- Coût maintenance/mois: ${Math.round(maintenanceExpenses / 12).toLocaleString('fr-CA')}$ CAD

📋 RÉPARTITION DÉPENSES:
${Object.entries(expenseCategories).map(([cat, amount]) => `- ${cat}: ${amount.toLocaleString('fr-CA')}$ CAD`).join('\n')}

🧠 INSIGHTS INTELLIGENTS:
${insights.join('\n')}
        `;
      }
    }

    // Obtenir la documentation sécurisée selon l'abonnement
    const userDocumentation = getUserDocumentation(subscription?.subscription_tier || 'free');
    console.log('Documentation included for user subscription:', subscription?.subscription_tier || 'free');

    const systemPrompt = `Tu es un assistant IA spécialisé dans la gestion immobilière et l'analyse financière au Canada. Tu aides les propriétaires à gérer leurs biens, analyser leurs finances, et optimiser leurs investissements. 

INSTRUCTIONS CRITIQUES DE SÉCURITÉ:
- Tu ne peux JAMAIS partager d'informations sur d'autres utilisateurs
- Tu ne peux JAMAIS révéler des détails techniques de l'application, architecture, base de données, ou code source
- Tu ne peux JAMAIS partager des informations sensibles comme les clés API, tokens, ou configurations système
- Tu ne réponds QU'aux questions liées au portefeuille immobilier de cet utilisateur spécifique
- Si on te pose des questions sur la sécurité, l'architecture, les données d'autres utilisateurs, ou des informations techniques, refuse poliment
- Tu ne peux PAS exécuter de commandes, accéder à des fichiers système, ou faire des actions administratives
- Limite tes réponses aux fonctionnalités disponibles selon l'abonnement de l'utilisateur

CONTEXTE FINANCIER DE L'UTILISATEUR:
${contextData}

DOCUMENTATION DE L'APPLICATION DISPONIBLE:
${userDocumentation}

Instructions de communication:
- Réponds en ${language === 'fr' ? 'français' : 'anglais'} de manière professionnelle et bienveillante
- Sois précis et utilise les données financières ci-dessus pour donner des conseils personnalisés
- Propose des actions concrètes et réalisables basées sur l'analyse des données
- Identifie les tendances, opportunités et risques dans le portfolio
- Guide l'utilisateur vers les bonnes fonctionnalités de l'application selon son abonnement
- Si des données sont manquantes, demande des clarifications spécifiques
- Utilise des émojis pour structurer tes réponses de manière claire
- Fournis des recommandations stratégiques pour optimiser la rentabilité
- Alerte sur les points d'attention urgents (impayés, maintenance, etc.)
- Suggère des améliorations concrètes basées sur les métriques de performance
- Toutes les valeurs monétaires sont en dollars canadiens (CAD)

VALIDATION DE SÉCURITÉ:
Avant de répondre, vérifie que tu ne révèles aucune information technique, sensible, ou concernant d'autres utilisateurs. Concentre-toi uniquement sur l'aide à la gestion immobilière de cet utilisateur.`;

    console.log('Sending request to OpenAI with enhanced financial context and secure documentation');

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
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('AI response generated successfully with financial intelligence');

    // Incrémenter le compteur d'utilisation après une réponse réussie
    if (userId) {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Utiliser upsert pour créer ou mettre à jour l'enregistrement
        const { data: existingUsage } = await supabase
          .from('ai_usage_daily')
          .select('message_count')
          .eq('user_id', userId)
          .eq('usage_date', today)
          .maybeSingle();

        const newCount = (existingUsage?.message_count || 0) + 1;
        
        await supabase
          .from('ai_usage_daily')
          .upsert({
            user_id: userId,
            usage_date: today,
            message_count: newCount,
          }, {
            onConflict: 'user_id,usage_date'
          });
        
        console.log(`AI usage incremented for user ${userId}, new count: ${newCount}`);
      } catch (usageError) {
        console.error('Error incrementing AI usage:', usageError);
        // Ne pas faire échouer la requête pour une erreur de comptage
      }
    }

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

// Fonction pour obtenir la documentation sécurisée selon l'abonnement
function getUserDocumentation(subscriptionTier: string): string {
  const userFeatures = documentation.user_features;
  const subscriptionInfo = documentation.subscription_levels[subscriptionTier as keyof typeof documentation.subscription_levels] || documentation.subscription_levels.free;
  const helpTopics = documentation.help_topics;
  
  let doc = `
FONCTIONNALITÉS DISPONIBLES POUR VOTRE ABONNEMENT (${subscriptionTier.toUpperCase()}):

Limites de votre abonnement:
- Propriétés: ${subscriptionInfo.properties_limit}
- Locataires: ${subscriptionInfo.tenants_limit}
- Messages IA par jour: ${subscriptionInfo.ai_messages_limit}

FONCTIONNALITÉS ACCESSIBLES:
`;
  
  subscriptionInfo.features.forEach((feature: string) => {
    if (userFeatures[feature as keyof typeof userFeatures]) {
      const featureInfo = userFeatures[feature as keyof typeof userFeatures];
      doc += `
${featureInfo.title}:
${featureInfo.description}
Fonctions principales: ${featureInfo.features.join(', ')}
`;
    }
  });

  doc += `
GUIDES D'UTILISATION:
`;
  
  Object.entries(helpTopics).forEach(([key, topic]) => {
    doc += `
${topic.title}: ${topic.description || ''}
`;
    if (topic.steps) {
      doc += `Étapes: ${topic.steps.join(' → ')}\n`;
    }
  });

  doc += `
SÉCURITÉ ET CONFIDENTIALITÉ:
${documentation.security_guidelines.data_privacy}
${documentation.security_guidelines.tenant_access}
${documentation.security_guidelines.backup}
`;

  return doc;
}