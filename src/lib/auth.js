import { loadStore, saveStore } from './plans';
import { api } from './api';

// ── Store accessors ───────────────────────────────────────────────
export const getUser         = () => loadStore().user         ?? null;
export const getPlan         = () => loadStore().plan         ?? null;
export const getToken        = () => loadStore().token        ?? null;
export const getSelectedPlan = () => loadStore().selectedPlan ?? 'family';

export const setUser         = (u) => saveStore({ user: u });
export const setPlan         = (p) => saveStore({ plan: p });
export const setToken        = (t) => saveStore({ token: t });
export const setSelectedPlan = (id) => saveStore({ selectedPlan: id });

export const logout = () => saveStore({ user: null, plan: null, token: null });

/**
 * Persist a successful auth response from the backend.
 * Works for both email/OTP login and Google OAuth.
 */
export function applySession({ access_token, user }) {
  if (access_token) setToken(access_token);
  if (user) {
    setUser(user);
    if (user.planId) setPlan(user.planId);
  }
}

// ── Auth actions (all backed by the real API) ─────────────────────

/**
 * Register a new account.
 * The backend always responds with { otpRequired: true } — no JWT yet.
 */
export async function signUp({ name, email, password, phone, referredBy }) {
  return api.auth.register({ name, email, password, phone, referredBy });
}

/**
 * Sign in with email + password.
 * Returns either { access_token, user } (no 2FA) or { otpRequired: true } (2FA enabled).
 * Stores the session automatically when a token is returned.
 */
export async function signIn({ email, password }) {
  const res = await api.auth.login(email, password);
  if (!res.otpRequired) applySession(res);
  return res;
}

/**
 * Verify the 6-digit OTP (used for both registration and 2FA login).
 * On success stores the session and returns { access_token, user }.
 */
export async function verifyOtp(email, otp) {
  const res = await api.auth.verifyOtp(email, otp);
  applySession(res);
  return res;
}

/**
 * Resend a new OTP to the given email.
 */
export const resendOtp = (email) => api.auth.resendOtp(email);
