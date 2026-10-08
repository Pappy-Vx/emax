export const STORE = 'emax_proto_v1';

export function loadStore() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
}

export function saveStore(patch) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORE, JSON.stringify({ ...loadStore(), ...patch })); } catch {}
}

export const SINGLE_ERRAND_PRICE = 19.99;

export const PLANS = [
  {
    id: 'single_errand',
    name: 'Single Errand',
    tagline: 'Pay As You Go',
    price: SINGLE_ERRAND_PRICE,
    yearlyPrice: SINGLE_ERRAND_PRICE,
    rank: 0,
    errands: 1,
    for: 'One-off errand beyond your plan limit',
    iconKey: 'List',
    features: [
      '1 errand, scheduled after payment',
      '$19.99 one-time charge',
      'Same-day availability',
      'No subscription required',
    ],
  },
  {
    id: 'individual',
    name: 'Individual',
    tagline: 'Everyday Ease',
    price: 83.99,
    yearlyPrice: 839.90,  // save $167.98 — 2 months free
    rank: 1,
    errands: 5,
    for: 'Busy professionals & solo households',
    iconKey: 'Briefcase',
    features: [
      '5 errands per month',
      'Same-day scheduling',
      '$16.79 per errand (vs $19.99 pay-as-you-go)',
      '2 saved addresses',
      'Text updates on every errand',
      'Unused errands roll over 1 month',
    ],
  },
  {
    id: 'family',
    name: 'Family & Senior Care',
    tagline: 'Helping Hand',
    price: 149.99,
    yearlyPrice: 1499.90,  // save $299.98 — 2 months free
    rank: 2,
    errands: 10,
    for: 'Families, seniors & caregivers',
    popular: true,
    iconKey: 'Heart',
    features: [
      '10 errands per month',
      'Priority pharmacy pickups',
      '$14.99 per errand (vs $19.99 pay-as-you-go)',
      'Recurring weekly schedule',
      'Up to 5 saved addresses',
      'Caregiver updates included',
      'Unused errands roll over 1 month',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Business Support',
    price: 311.99,
    yearlyPrice: 3119.90,  // save $623.98 — 2 months free
    rank: 3,
    errands: 24,
    for: 'Offices, shops & small teams',
    iconKey: 'Building',
    features: [
      '24 errands per month',
      'Document & supply runs',
      '$12.99 per errand (vs $19.99 pay-as-you-go)',
      'Up to 3 team logins',
      'Unlimited saved addresses',
      'Monthly invoice & receipts',
      'Priority same-day slots',
    ],
  },
];

export const ADDRESS_LIMIT = { individual: 2, family: 5, business: 99 };

export const PLAN_MAP = new Map(PLANS.map((p) => [p.id, p]));

/** Returns the dollar amount for a given plan + billing cycle */
export function planPrice(planId, cycle) {
  const p = PLAN_MAP.get(planId);
  if (!p) return 0;
  return cycle === 'yearly' ? p.yearlyPrice : p.price;
}

/** Returns yearly savings vs 12 months of monthly billing */
export function yearlySavings(planId) {
  const p = PLAN_MAP.get(planId);
  if (!p) return 0;
  return p.price * 12 - p.yearlyPrice;
}
