// Energy Dashboard — Cloudflare Pages Worker
// Place this file in the root of the GitHub repo
// Cloudflare Pages serves index.html AND handles /api/* via this worker

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only intercept /api route — everything else serves static files
    if (url.pathname !== '/api') {
      return env.ASSETS.fetch(request);
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await request.json();

      if (!env.WORKER_SECRET || body._secret !== env.WORKER_SECRET) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      body._secret = env.APPS_SCRIPT_SECRET;

      const asResponse = await fetch(env.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        redirect: 'follow'
      });

      const data = await asResponse.text();

      return new Response(data, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Worker error', detail: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
