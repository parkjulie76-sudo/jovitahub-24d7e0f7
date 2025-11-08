import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { csvData, videoId } = await req.json();

    // Parse CSV data (expecting format: sale_id, affiliate_id, sale_amount, commission_amount, sale_date, product_name, buyer_email)
    const rows = csvData.trim().split('\n');
    const headers = rows[0].toLowerCase().split(',');
    
    const salesData = [];
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(',');
      const sale = {
        payhip_sale_id: values[headers.indexOf('sale_id')] || values[headers.indexOf('order_id')],
        affiliate_id: values[headers.indexOf('affiliate_id')] || values[headers.indexOf('affiliate')],
        sale_amount: parseFloat(values[headers.indexOf('sale_amount')] || values[headers.indexOf('amount')]),
        commission_amount: parseFloat(values[headers.indexOf('commission_amount')] || values[headers.indexOf('commission')]),
        sale_date: values[headers.indexOf('sale_date')] || values[headers.indexOf('date')],
        product_name: values[headers.indexOf('product_name')] || values[headers.indexOf('product')],
        buyer_email: values[headers.indexOf('buyer_email')] || values[headers.indexOf('email')],
      };

      if (sale.payhip_sale_id) {
        salesData.push(sale);
      }
    }

    console.log(`Processing ${salesData.length} sales records`);

    // Insert sales data
    const insertedSales = [];
    for (const sale of salesData) {
      const { data: existingSale } = await supabase
        .from('payhip_sales')
        .select('id')
        .eq('payhip_sale_id', sale.payhip_sale_id)
        .maybeSingle();

      if (!existingSale) {
        const { data: insertedSale, error } = await supabase
          .from('payhip_sales')
          .insert({
            video_id: videoId,
            payhip_sale_id: sale.payhip_sale_id,
            affiliate_id: sale.affiliate_id,
            sale_amount: sale.sale_amount,
            commission_amount: sale.commission_amount,
            sale_date: new Date(sale.sale_date).toISOString(),
            product_name: sale.product_name,
            buyer_email: sale.buyer_email,
            imported_by: user.id,
          })
          .select()
          .single();

        if (!error && insertedSale) {
          insertedSales.push(insertedSale);
        } else {
          console.error('Error inserting sale:', error);
        }
      }
    }

    // Calculate commission splits for each sale
    for (const sale of insertedSales) {
      // Get all contributors for this video
      const { data: contributors } = await supabase
        .from('project_contributors')
        .select('*')
        .eq('video_id', sale.video_id);

      if (contributors && contributors.length > 0) {
        // Calculate split amounts
        for (const contributor of contributors) {
          const splitAmount = (sale.commission_amount * contributor.commission_percentage) / 100;

          await supabase
            .from('commission_splits')
            .insert({
              sale_id: sale.id,
              contributor_id: contributor.user_id,
              video_id: sale.video_id,
              commission_amount: splitAmount,
              commission_percentage: contributor.commission_percentage,
            });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: insertedSales.length,
        total: salesData.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing CSV:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});