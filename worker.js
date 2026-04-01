const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwgGPt16nqYuw0FOwIdSHfjlj_0A4C-tl-EPXLK_5v_h75VBvSlevE0M8fanCifUiwt/exec";
const ALLOWED_ORIGIN = "https://flpintoc-hue.github.io";

export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (!["GET", "POST"].includes(request.method)) {
      return new Response("Method not allowed", { status: 405 });
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
        const incoming = new URL(request.url);
        const target = new URL(APPS_SCRIPT_URL);
        incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));
        appsScriptUrl = target.toString();
      }

      const response = await fetch(appsScriptUrl, fetchOptions);
      const data = await response.text();

      return new Response(data, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      });
    }
  }
};
