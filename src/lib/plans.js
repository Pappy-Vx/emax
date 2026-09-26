export const STORE = 'emax_proto_v1';

export function loadStore() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
}

export function saveStore(patch) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORE, JSON.stringify({ ...loadStore(), ...patch })); } catch {}
}

export const PLANS = [
  {
    id: 'individual',
    name: 'Individual',
    price: 49,
    errands: 4,
    for: 'Busy professionals & solo households',
    iconKey: 'Briefcase',
    features: [
      '4 errands per month',
      'Same-day scheduling',
      '2 saved addresses',
      'Text updates on every errand',
      'Unused errands roll over 1 month',
    ],
  },
  {
    id: 'family',
    name: 'Family & Senior Care',
    price: 99,
    errands: 10,
    for: 'Families, seniors & caregivers',
    popular: true,
    iconKey: 'Heart',
    features: [
      '10 errands per month',
      'Priority pharmacy pickups',
      'Recurring weekly schedule',
      'Up to 5 saved addresses',
      'Caregiver can get updates too',
      'Unused errands roll over 1 month',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 199,
    errands: 25,
    for: 'Offices, shops & small teams',
    iconKey: 'Building',
    features: [
      '25 errands per month',
      'Document & supply runs',
      'Up to 3 team logins',
      'Unlimited saved addresses',
      'Monthly invoice & receipts',
      'Priority same-day slots',
    ],
  },
];

export const ADDRESS_LIMIT = { individual: 2, family: 5, business: 99 };
