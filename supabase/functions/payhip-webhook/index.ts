import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayhipWebhookPayload {
  type: 'paid' | 'refunded' | 'subscription.created' | 'subscription.deleted';
  sale_id?: string;
  product_name?: string;
  product_link?: string;
  sale_amount?: number;
  currency?: string;
  affiliate_id?: string;
  affiliate_link?: string;
  buyer_email?: string;
  customer_email?: string;
  date?: number;
  signature?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Payhip webhook received');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse webhook payload
    const payload: PayhipWebhookPayload = await req.json();
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    // Only process 'paid' events for now
    if (payload.type !== 'paid') {
      console.log(`Ignoring event type: ${payload.type}`);
      return new Response(
        JSON.stringify({ message: 'Event type not processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Validate required fields
    if (!payload.sale_id || !payload.sale_amount || !payload.affiliate_id) {
      console.error('Missing required fields in webhook payload');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Find the user by their affiliate ID from their creator application
    const { data: applications, error: appError } = await supabase
      .from('creator_applications')
      .select('user_id, affiliate_link')
      .eq('status', 'approved')
      .ilike('affiliate_link', `%${payload.affiliate_id}%`);

    if (appError) {
      console.error('Error finding user by affiliate:', appError);
      throw appError;
    }

    if (!applications || applications.length === 0) {
      console.log(`No approved user found with affiliate ID: ${payload.affiliate_id}`);
      return new Response(
        JSON.stringify({ message: 'No user found with this affiliate ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const userId = applications[0].user_id;
    console.log(`Found user: ${userId} for affiliate: ${payload.affiliate_id}`);

    // Check if this sale already exists
    const { data: existingSale, error: saleCheckError } = await supabase
      .from('payhip_sales')
      .select('id')
      .eq('payhip_sale_id', payload.sale_id)
      .maybeSingle();

    if (saleCheckError) {
      console.error('Error checking existing sale:', saleCheckError);
      throw saleCheckError;
    }

    if (existingSale) {
      console.log(`Sale ${payload.sale_id} already processed`);
      return new Response(
        JSON.stringify({ message: 'Sale already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Calculate commission (using 10% as default, can be configured later)
    const commissionPercentage = 0.10; // 10%
    const commissionAmount = payload.sale_amount * commissionPercentage;

    // Insert the sale record
    const saleDate = payload.date ? new Date(payload.date * 1000).toISOString() : new Date().toISOString();
    
    const { data: saleData, error: saleError } = await supabase
      .from('payhip_sales')
      .insert({
        payhip_sale_id: payload.sale_id,
        product_name: payload.product_name || 'Unknown Product',
        sale_amount: payload.sale_amount,
        commission_amount: commissionAmount,
        affiliate_id: payload.affiliate_id,
        affiliate_link: payload.affiliate_link || payload.affiliate_id,
        buyer_email: payload.buyer_email || payload.customer_email,
        sale_date: saleDate,
        imported_by: null, // Automatically imported via webhook
      })
      .select()
      .single();

    if (saleError) {
      console.error('Error inserting sale:', saleError);
      throw saleError;
    }

    console.log(`Sale recorded: ${saleData.id}`);

    // Create commission split record for the user
    const { data: commissionData, error: commissionError } = await supabase
      .from('commission_splits')
      .insert({
        sale_id: saleData.id,
        contributor_id: userId,
        video_id: null, // Direct affiliate sale, not tied to a specific video project
        commission_percentage: commissionPercentage * 100, // Store as percentage (10)
        commission_amount: commissionAmount,
      })
      .select()
      .single();

    if (commissionError) {
      console.error('Error creating commission split:', commissionError);
      throw commissionError;
    }

    console.log(`Commission split created: ${commissionData.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        sale_id: saleData.id,
        commission_id: commissionData.id,
        message: 'Sale and commission processed successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
