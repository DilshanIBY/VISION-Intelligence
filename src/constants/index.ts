// Application constants and configuration
export const APP_NAME = 'VISION';
export const APP_VERSION = '0.1.0';
export const APP_DESCRIPTION = 'Where Vision Intelligence Meets Elegant Design';

// API configuration (will be populated in Phase 5)
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// Navigation routes
export const ROUTES = {
  DASHBOARD: '/dashboard',
  CALCULATOR: '/calculator',
  FLOOR_LAYOUT: '/floor-layout',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

// Department space multipliers (from PRD §3.2.4)
export const DEPARTMENT_SPACE_RULES = {
  warehouse: { baseMultiplier: 0.8, minArea: 100 },
  cutting: { baseMultiplier: 0.25, minArea: 50 },
  sewing: { baseMultiplier: 6, minArea: 200 },
  embroidery: { baseMultiplier: 15, minArea: 30 },
  finishing: { baseMultiplier: 0.18, minArea: 40 },
  packing: { baseMultiplier: 0.12, minArea: 30 },
  utilities: { baseMultiplier: 0.08, minArea: 20 },
} as const;

// Product type modifiers (from PRD §3.2.3)
export const PRODUCT_TYPES = {
  IW: { name: 'Innerwear', modifier: 0.85, departments: 'Standard' },
  OW: { name: 'Outerwear', modifier: 1.15, departments: '+ Heavy Cutting' },
  CS: { name: 'Casual', modifier: 1.0, departments: 'Standard' },
  WC: { name: 'Wash & Casual', modifier: 1.25, departments: '+ Wash Bay' },
  SW: { name: 'Sportswear', modifier: 1.1, departments: '+ Sublimation' },
} as const;
