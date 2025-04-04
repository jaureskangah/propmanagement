
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { templateType, documentTitle, existingContent, instructions } = await req.json();
    
    // Generate prompt for OpenAI based on the template and instructions
    let prompt = `Tu es un assistant spécialisé dans la rédaction de documents juridiques et administratifs. `;
    prompt += `Je te demande de générer ou d'améliorer le contenu d'un document de type "${templateType}" intitulé "${documentTitle}". `;
    
    if (existingContent) {
      prompt += `Voici le contenu actuel du document que tu dois améliorer:\n\n${existingContent}\n\n`;
    }
    
    if (instructions) {
      prompt += `Instructions spécifiques: ${instructions}\n\n`;
    }
    
    prompt += `Produis un texte bien structuré, professionnel et conforme aux normes juridiques. Utilise un langage clair et précis.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un assistant spécialisé dans la rédaction de documents juridiques et administratifs.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI API');
    }

    const generatedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      content: generatedContent,
      status: 'success'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating document content:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
