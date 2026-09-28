export interface Plan {
  id: string;
  name: string;
  price: number;        // USD per month
  yearlyPrice: number;  // USD per year (10 months = 2 months free)
  rank: number;         // for upgrade-only enforcement: 1=individual, 2=family, 3=business
  errands: number;      // included errands per month
  addressLimit: number; // max saved addresses
  popular?: boolean;
  description: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'individual',
    name: 'Individual',
    price: 83.99,
    yearlyPrice: 839.90,   // save $167.98 (2 months free)
    rank: 1,
    errands: 5,
    addressLimit: 2,
    description: 'Everyday Ease — perfect for solo professionals and busy individuals.',
    features: [
      '5 errands per month',
      '$16.79 per errand',
      'Up to 2 saved addresses',
      'Same-day scheduling',
      'Real-time errand tracking',
      'Email & SMS status updates',
    ],
  },
  {
    id: 'family',
    name: 'Family & Senior Care',
    price: 149.99,
    yearlyPrice: 1499.90,   // save $299.98 (2 months free)
    rank: 2,
    errands: 10,
    addressLimit: 5,
    popular: true,
    description: 'Helping Hand — designed for households and those caring for a senior loved one.',
    features: [
      '10 errands per month',
      '$14.99 per errand',
      'Up to 5 saved addresses',
      'Priority pharmacy pickups',
      'Same-day scheduling',
      'Recurring errand support',
      'Caregiver updates included',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 311.99,
    yearlyPrice: 3119.90,  // save $623.98 (2 months free)
    rank: 3,
    errands: 24,
    addressLimit: 99,
    description: 'Business Support — built for small businesses with high-volume errand needs.',
    features: [
      '24 errands per month',
      '$12.99 per errand',
      'Unlimited saved addresses',
      'Document & supply runs',
      'Up to 3 team logins',
      'Priority same-day slots',
      'Monthly invoice & receipts',
    ],
  },
];

export const PLAN_MAP = new Map<string, Plan>(PLANS.map((p) => [p.id, p]));

export const ADDRESS_LIMIT: Record<string, number> = Object.fromEntries(
  PLANS.map((p) => [p.id, p.addressLimit]),
);
