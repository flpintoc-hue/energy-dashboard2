/*
  ═══════════════════════════════════════════════════════
  API SERVICE - SECURE VERSION WITH JWT
  
  This file centralizes ALL communication with your 
  Cloudflare Worker backend using JWT authentication.
  ═══════════════════════════════════════════════════════
*/

const WORKER_URL = 'https://energy-dashboard-proxy.flpintoc.workers.dev';
const TOKEN_KEY = 'energy_dash_token';
const USER_KEY = 'energy_dash_user';

// ── Token Management ──
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Check if token is expired (decode JWT)
function isTokenExpired() {
  const token = getToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
}

// ── Authenticated API Request ──
async function authenticatedFetch(endpoint, data = {}) {
  const token = getToken();
  
  if (!token || isTokenExpired()) {
    clearSession();
    window.location.reload(); // Force re-login
    throw new Error('Session expired');
  }
  
  try {
    const resp = await fetch(`${WORKER_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    
    const result = await resp.json();
    
    if (!resp.ok) {
      throw new Error(result.error || 'Request failed');
    }
    
    return result;
  } catch (err) {
    console.error(`API error [${endpoint}]:`, err);
    throw err;
  }
}

// ── Authentication (NO JWT required) ──
export async function loginUser(username, password) {
  try {
    const resp = await fetch(`${WORKER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const result = await resp.json();
    
    if (!resp.ok) {
      throw new Error(result.error || 'Login failed');
    }
    
    if (result.success && result.token) {
      saveToken(result.token);
      saveUser(result.user);
    }
    
    return result;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

export function logout() {
  clearSession();
  window.location.reload();
}

// ── DNC ──
export async function checkDNC(phone) {
  return authenticatedFetch('/api/data/check_dnc', { 
    action: 'check_dnc',
    phone 
  });
}

export async function getDNCList() {
  return authenticatedFetch('/api/data/get_dnc_list', {
    action: 'get_dnc_list'
  });
}

// ── Data (States, Utilities, Suppliers, Rates) ──
export async function getStates() {
  return authenticatedFetch('/api/data/get_states', {
    action: 'get_states'
  });
}

export async function getUtilities() {
  return authenticatedFetch('/api/data/get_utilities', {
    action: 'get_utilities'
  });
}

export async function getSuppliers() {
  return authenticatedFetch('/api/data/get_suppliers', {
    action: 'get_suppliers'
  });
}

export async function getRates() {
  return authenticatedFetch('/api/data/get_rates', {
    action: 'get_rates'
  });
}

// ── Users ──
export async function getUsers() {
  return authenticatedFetch('/api/data/get_users', {
    action: 'get_users'
  });
}

// ── Sales ──
export async function getAgentSales(agent) {
  return authenticatedFetch('/api/data/get_agent_sales', { 
    action: 'get_agent_sales',
    agent 
  });
}

export async function recordSale(saleData) {
  return authenticatedFetch('/api/data/record_sale', {
    action: 'save_sale',
    ...saleData
  });
}

// ── Chat ──
export async function sendChatMessage(message, username, token) {
  return authenticatedFetch('/api/data/chat_send', { 
    action: 'chat_send',
    message, 
    username, 
    token 
  });
}

export async function fetchChatMessages(sinceGroup, sincePrivate, user, role) {
  return authenticatedFetch('/api/data/chat_fetch', {
    action: 'chat_fetch',
    since_group: sinceGroup,
    since_private: sincePrivate,
    user,
    role,
  });
}

// ── Supervisor ──
export async function getSupervisorStatus() {
  return authenticatedFetch('/api/data/get_supervisor_status', {
    action: 'get_supervisor_status'
  });
}

// ── WhatsApp notification (now from server) ──
export async function sendWhatsApp(phone, message) {
  return authenticatedFetch('/api/notifications/whatsapp', { 
    to: phone,
    message 
  });
}

// ── Session Management ──
export async function checkSession(username, token) {
  // Not needed with JWT - token validation is automatic
  return { valid: !isTokenExpired() };
}

export async function registerSession(username, token) {
  // Not needed with JWT - login creates session
  return { success: true };
}

export async function releaseSession(username, token) {
  // Logout handled by clearSession
  logout();
}

export async function heartbeat(username, token) {
  // Not needed with JWT - token has expiration
  return { alive: true };
}

// ── Session beacon (for page close) ──
export function releaseSessionBeacon(username, token) {
  // Optional: notify server of logout
  // For now, JWT expiration handles this
  clearSession();
}

// Export utilities for components
export { getToken, saveToken, getUser, saveUser, clearSession, isTokenExpired };
