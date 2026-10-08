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
