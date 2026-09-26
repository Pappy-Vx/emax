import { loadStore, saveStore } from './plans';

export function getUser() { return loadStore().user ?? null; }
export function getPlan() { return loadStore().plan ?? null; }
export function getSelectedPlan() { return loadStore().selectedPlan ?? 'family'; }
export function setUser(u) { saveStore({ user: u }); }
export function setPlan(p) { saveStore({ plan: p }); }
export function setSelectedPlan(id) { saveStore({ selectedPlan: id }); }
export function logout() { saveStore({ user: null, plan: null }); }

export async function signIn({ email, password, name: displayName }) {
  if (!email || !password) throw new Error('Email and password are required.');
  await new Promise((r) => setTimeout(r, 700));
  // TODO: replace with POST /api/auth/login → { user, token }
  const name = displayName || email
    .split('@')[0]
    .replace(/[._\-+]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const user = { id: 'mock-001', name, email, phone: '', role: 'customer' };
  setUser(user);
  return user;
}

export async function signUp({ email, password, name }) {
  if (!email || !password || !name) throw new Error('All fields are required.');
  await new Promise((r) => setTimeout(r, 900));
  // TODO: replace with POST /api/auth/register
  const user = { id: 'mock-' + Date.now(), name, email, phone: '', role: 'customer' };
  setUser(user);
  return user;
}
