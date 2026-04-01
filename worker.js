// Energy Dashboard — Combined Worker
// Sirve el HTML estático Y actúa como proxy hacia Apps Script
// Las credenciales van en Variables de entorno — nunca en el código

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── POST /api → proxy hacia Apps Script ──────────────────
    if (request.method === 'POST' && url.pathname === '/api') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      try {
        const body = await request.json();

        // Validar que el request viene del app
        if (!env.WORKER_SECRET || body._secret !== env.WORKER_SECRET) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Reemplazar con el secret real de Apps Script
        body._secret = env.APPS_SCRIPT_SECRET;

        // Reenviar a Apps Script
        const asResp = await fetch(env.APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          redirect: 'follow'
        });

        const data = await asResp.text();

        return new Response(data, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // ── OPTIONS preflight ─────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // ── GET / → servir el HTML ────────────────────────────────
    return env.ASSETS.fetch(request);
  }
};
