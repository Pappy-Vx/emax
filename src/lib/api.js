/**
 * Central API client for the eMax NestJS backend.
 * All requests go through apiFetch() which handles auth headers and error parsing.
 *
 * Base URL is set via BASE_API_URL in .env.local.
 */

const BASE = process.env.BASE_API_URL ?? 'https://emax-oohv.onrender.com/api/v1';

// Read token directly from localStorage (same store key as auth.js) — avoids circular imports
const STORE_KEY = 'emax_proto_v1';

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}').token ?? null;
  } catch {
    return null;
  }
}

async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getStoredToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  // 30-second timeout — Render free tier can take ~30s to wake from sleep
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      signal: controller.signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('The server is taking too long to respond. Please try again in a moment.');
    }
    // DNS failure, CORS blocked, network down, etc.
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }

  let data;
  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) {
    const msg = data?.message;
    // Show first validation message only — arrays from class-validator can be very long
    const text = Array.isArray(msg) ? msg[0] : (msg ?? 'Something went wrong. Please try again.');
    throw new Error(text);
  }

  return data;
}

export const api = {
  auth: {
    /** POST /auth/register → { otpRequired: true, message } */
    register: (dto) =>
      apiFetch('/auth/register', { method: 'POST', body: dto }),

    /** POST /auth/login → { access_token, user } | { otpRequired: true } */
    login: (email, password) =>
      apiFetch('/auth/login', { method: 'POST', body: { email, password } }),

    /** POST /auth/verify-otp → { access_token, user } */
    verifyOtp: (email, otp) =>
      apiFetch('/auth/verify-otp', { method: 'POST', body: { email, otp } }),

    /** POST /auth/resend-otp → { message } */
    resendOtp: (email) =>
      apiFetch('/auth/resend-otp', { method: 'POST', body: { email } }),

    /** Full URL for Google OAuth — browser navigates here (not a fetch) */
    googleUrl: () => `${BASE}/auth/google`,
  },

  users: {
    /** GET /users/me */
    me: () => apiFetch('/users/me', { auth: true }),

    /** PATCH /users/me/plan */
    updatePlan: (planId) =>
      apiFetch('/users/me/plan', { method: 'PATCH', body: { planId }, auth: true }),

    /** PATCH /users/me/2fa */
    toggle2fa: (enabled) =>
      apiFetch('/users/me/2fa', { method: 'PATCH', body: { twoFaEnabled: enabled }, auth: true }),
  },

  addresses: {
    /** GET /addresses */
    list: () => apiFetch('/addresses', { auth: true }),

    /** POST /addresses */
    create: (dto) =>
      apiFetch('/addresses', { method: 'POST', body: dto, auth: true }),

    /** PATCH /addresses/:id */
    update: (id, dto) =>
      apiFetch(`/addresses/${id}`, { method: 'PATCH', body: dto, auth: true }),

    /** DELETE /addresses/:id */
    remove: (id) =>
      apiFetch(`/addresses/${id}`, { method: 'DELETE', auth: true }),

    /** PATCH /addresses/:id/primary */
    setPrimary: (id) =>
      apiFetch(`/addresses/${id}/primary`, { method: 'PATCH', auth: true }),
  },

  errands: {
    /** GET /errands */
    list: () => apiFetch('/errands', { auth: true }),

    /** POST /errands */
    create: (dto) =>
      apiFetch('/errands', { method: 'POST', body: dto, auth: true }),

    /** GET /errands/:id */
    get: (id) => apiFetch(`/errands/${id}`, { auth: true }),

    /** PATCH /errands/:id/cancel */
    cancel: (id) =>
      apiFetch(`/errands/${id}/cancel`, { method: 'PATCH', auth: true }),
  },

  payment: {
    /** POST /payment/process */
    process: (dto) =>
      apiFetch('/payment/process', { method: 'POST', body: dto, auth: true }),

    /** GET /payment/history */
    history: () => apiFetch('/payment/history', { auth: true }),
  },

  subscription: {
    /** GET /subscription/me → active Subscription | null */
    me: () => apiFetch('/subscription/me', { auth: true }),

    /** POST /subscription/preview-switch → { prorationCreditCents, chargedCents } */
    previewSwitch: (planId, billingCycle) =>
      apiFetch('/subscription/preview-switch', { method: 'POST', body: { planId, billingCycle }, auth: true }),

    /** POST /subscription/switch → { subscription, prorationCreditCents, chargedCents } */
    switch: (planId, billingCycle) =>
      apiFetch('/subscription/switch', { method: 'POST', body: { planId, billingCycle }, auth: true }),

    /** PATCH /subscription/cancel */
    cancel: () => apiFetch('/subscription/cancel', { method: 'PATCH', auth: true }),

    /** PATCH /subscription/autorenew */
    toggleAutoRenew: (autoRenew) =>
      apiFetch('/subscription/autorenew', { method: 'PATCH', body: { autoRenew }, auth: true }),
  },

  wallet: {
    /** GET /wallet */
    list: () => apiFetch('/wallet', { auth: true }),

    /** POST /wallet — save a card, google_pay, or apple_pay */
    save: (dto) => apiFetch('/wallet', { method: 'POST', body: dto, auth: true }),

    /** PATCH /wallet/:id/default */
    setDefault: (id) => apiFetch(`/wallet/${id}/default`, { method: 'PATCH', auth: true }),

    /** DELETE /wallet/:id */
    remove: (id) => apiFetch(`/wallet/${id}`, { method: 'DELETE', auth: true }),
  },

  plans: {
    /** GET /plans — public, no auth required */
    list: () => apiFetch('/plans'),
  },

  notifications: {
    /** GET /notifications/me?days=N */
    me: (days = 30) => apiFetch(`/notifications/me?days=${days}`, { auth: true }),

    /** PATCH /notifications/:id/read */
    markRead: (id) => apiFetch(`/notifications/${id}/read`, { method: 'PATCH', auth: true }),
  },

  flags: {
    /** GET /feature-flags — public */
    list: () => apiFetch('/feature-flags'),
  },
};
