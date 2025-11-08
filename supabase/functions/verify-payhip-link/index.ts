import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { affiliateLink } = await req.json();

    console.log('Verifying Payhip affiliate link:', affiliateLink);

    if (!affiliateLink) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Affiliate link is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate URL format
    let url: URL;
    try {
      url = new URL(affiliateLink);
    } catch {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid URL format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify it's a Payhip domain
    if (!url.hostname.includes('payhip.com')) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Link must be from payhip.com domain' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if the link is accessible (HEAD request to avoid downloading content)
    try {
      const checkResponse = await fetch(affiliateLink, {
        method: 'HEAD',
        redirect: 'follow',
        headers: {
          'User-Agent': 'JovitaHub-Verification/1.0'
        }
      });

      console.log('Link check status:', checkResponse.status);

      if (checkResponse.ok || checkResponse.status === 302 || checkResponse.status === 301) {
        // Link is accessible (200 OK or redirects are fine for affiliate links)
        return new Response(
          JSON.stringify({ 
            valid: true, 
            message: 'Affiliate link is valid and accessible',
            statusCode: checkResponse.status
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else if (checkResponse.status === 404) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'Affiliate link not found. Please check the URL is correct.',
            statusCode: checkResponse.status
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'Unable to verify affiliate link. Please ensure the URL is correct.',
            statusCode: checkResponse.status
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } catch (fetchError) {
      console.error('Error checking link accessibility:', fetchError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Unable to verify link accessibility. Please check the URL.'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in verify-payhip-link function:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: 'Server error during verification' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
