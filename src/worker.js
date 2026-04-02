const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwgGPt16nqYuw0FOwIdSHfjlj_0A4C-tl-EPXLK_5v_h75VBvSlevE0M8fanCifUiwt/exec";

const SECURITY_HEADERS = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api") {

      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      try {
        let appsScriptUrl = APPS_SCRIPT_URL;
        let fetchOptions = {
          method: request.method,
          headers: { "Content-Type": "application/json" },
          redirect: "follow"
        };

        if (request.method === "POST") {
          const body = await request.text();
          fetchOptions.body = body;
        } else {
          const target = new URL(APPS_SCRIPT_URL);
          url.searchParams.forEach((v, k) => target.searchParams.set(k, v));
          appsScriptUrl = target.toString();
        }

        const response = await fetch(appsScriptUrl, fetchOptions);
        const data = await response.text();

        return new Response(data, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            ...SECURITY_HEADERS,
          },
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    // Serve static assets (index.html)
    const assetResponse = await env.ASSETS.fetch(request);
    const newResponse = new Response(assetResponse.body, assetResponse);
    Object.entries(SECURITY_HEADERS).forEach(([k, v]) => {
      newResponse.headers.set(k, v);
    });
    return newResponse;
  }
};
