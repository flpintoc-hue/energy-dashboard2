// ═══════════════════════════════════════════════════════════
// Energy Dashboard — Cloudflare Worker
// Rate Limiting via KV Storage
// ═══════════════════════════════════════════════════════════

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwgGPt16nqYuw0FOwIdSHfjlj_0A4C-tl-EPXLK_5v_h75VBvSlevE0M8fanCifUiwt/exec";

// ── Rate limit config per action ────────────────────────────
// windowSec: time window in seconds
// max: max requests allowed in that window
// blockSec: how long to block after exceeding limit
const RATE_LIMITS = {
  authenticate: { windowSec: 60,   max: 5,   blockSec: 600  }, // 5 login attempts/min → block 10 min
  check_dnc:    { windowSec: 60,   max: 30,  blockSec: 60   }, // 30 DNC checks/min
  notify_dnc:   { windowSec: 60,   max: 20,  blockSec: 60   }, // 20 WA notifs/min
  save_sale:    { windowSec: 60,   max: 10,  blockSec: 60   }, // 10 sales/min
  chat_send:    { windowSec: 60,   max: 40,  blockSec: 30   }, // 40 chat msgs/min
  default:      { windowSec: 60,   max: 60,  blockSec: 30   }, // everything else
};

// ── CORS headers ─────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── Helper: JSON response ─────────────────────────────────────
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

// ── Rate limiter using KV ─────────────────────────────────────
// Key format: "rl:{action}:{identifier}"
// Value: { count: N, windowStart: timestamp, blocked: bool, blockedUntil: timestamp }
async function checkRateLimit(kv, action, identifier) {
  // No KV bound? Skip rate limiting gracefully
  if (!kv) return { allowed: true };

  const cfg  = RATE_LIMITS[action] || RATE_LIMITS.default;
  const key  = `rl:${action}:${identifier}`;
  const now  = Date.now();

  let state;
  try {
    const raw = await kv.get(key);
    state = raw ? JSON.parse(raw) : null;
  } catch {
    // KV read error — fail open (allow request)
    return { allowed: true };
  }

  // ── Check if currently blocked ──
  if (state && state.blocked && state.blockedUntil > now) {
    const remainingSec = Math.ceil((state.blockedUntil - now) / 1000);
    return {
      allowed:    false,
      reason:     "blocked",
      remainingSec,
      retryAfter: remainingSec,
    };
  }

  // ── New window or expired window → reset ──
  if (!state || (now - state.windowStart) > cfg.windowSec * 1000) {
    state = { count: 1, windowStart: now, blocked: false, blockedUntil: 0 };
    await kv.put(key, JSON.stringify(state), { expirationTtl: cfg.windowSec + cfg.blockSec });
    return { allowed: true, remaining: cfg.max - 1 };
  }

  // ── Within window — increment ──
  state.count++;

  if (state.count > cfg.max) {
    // Block this identifier
    state.blocked     = true;
    state.blockedUntil = now + cfg.blockSec * 1000;
    await kv.put(key, JSON.stringify(state), { expirationTtl: cfg.blockSec + 10 });
    return {
      allowed:    false,
      reason:     "rate_exceeded",
      remainingSec: cfg.blockSec,
      retryAfter:   cfg.blockSec,
    };
  }

  // Still within limit
  await kv.put(key, JSON.stringify(state), { expirationTtl: cfg.windowSec + cfg.blockSec });
  return { allowed: true, remaining: cfg.max - state.count };
}

// ── Extract a safe identifier from request ────────────────────
// Uses IP + username (if available in body) for auth, IP only for others
function getIdentifier(ip, action, body) {
  const safeIp = ip || "unknown";
  if (action === "authenticate" && body) {
    try {
      const parsed = typeof body === "string" ? JSON.parse(body) : body;
      const user = (parsed.username || "").slice(0, 32).toLowerCase();
      if (user) return `${safeIp}:${user}`;
    } catch { /* ignore */ }
  }
  return safeIp;
}

// ── Main fetch handler ────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── OPTIONS preflight ──
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    // ── Only intercept /api ──
    if (url.pathname !== "/api") {
      return env.ASSETS.fetch(request);
    }

    // ── Parse body once ──
    let rawBody = "";
    let parsedBody = null;
    if (request.method === "POST") {
      rawBody = await request.text();
      try { parsedBody = JSON.parse(rawBody); } catch { /* not JSON */ }
    }

    // ── Identify action ──
    const action = parsedBody?.action || "default";

    // ── Get client IP ──
    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For")?.split(",")[0].trim() ||
      "unknown";

    // ── Rate limit check ──
    const identifier = getIdentifier(ip, action, parsedBody);
    const rl = await checkRateLimit(env.RATE_LIMITER, action, identifier);

    if (!rl.allowed) {
      const isLogin = action === "authenticate";
      return jsonResponse(
        {
          error:   isLogin
            ? `Demasiados intentos. Espera ${rl.remainingSec} segundos.`
            : "Rate limit exceeded. Try again shortly.",
          blocked: true,
          retryAfter: rl.retryAfter,
          reason:  rl.reason,
        },
        429
      );
    }

    // ── Validate _secret ──
    const secret = parsedBody?._secret;
    if (!secret || secret !== env.WORKER_SECRET) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // ── Forward to Apps Script ──
    try {
      let appsScriptUrl = APPS_SCRIPT_URL;
      const fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        body: rawBody,
      };

      if (request.method === "GET") {
        const target = new URL(APPS_SCRIPT_URL);
        url.searchParams.forEach((v, k) => target.searchParams.set(k, v));
        appsScriptUrl = target.toString();
        delete fetchOptions.body;
        fetchOptions.method = "GET";
      }

      const response = await fetch(appsScriptUrl, fetchOptions);
      const data     = await response.text();

      // Add rate limit headers to response
      return new Response(data, {
        status: 200,
        headers: {
          "Content-Type":               "application/json",
          "X-RateLimit-Remaining":      String(rl.remaining ?? 0),
          "X-RateLimit-Action":         action,
          ...CORS,
        },
      });

    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  },
};
