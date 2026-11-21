export const ERRAND_SERVICE_TYPES = [
  'Pharmacy Pickup',
  'Store Returns',
  'Store Pickups',
  'Document Delivery',
  'Post Office Runs',
  'Library Returns',
  'Forgotten Item Delivery',
  'Event Errand Support (Full Day)',
  'Custom Errands',
] as const;

export type ErrandServiceType = (typeof ERRAND_SERVICE_TYPES)[number];

// Matches the service categories on the public Services page.
export const ERRAND_CATEGORIES = [
  'Shopping & Retail',
  'Delivery & Drop-Off',
  'Mail, Shipping & Courier',
  'Pharmacy & Care Support',
  'Home & Personal Tasks',
  'Business & Office Support',
  'Events & Flexible Help',
] as const;

export const ERRAND_PAYMENT_STATUSES = ['paid', 'unpaid'] as const;
export type ErrandPaymentStatus = (typeof ERRAND_PAYMENT_STATUSES)[number];
