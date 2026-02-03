/**
 * Events barrel exports
 * @module types/events
 * @see PRD §5.4, §11 Phase 2 - Events & Triggers
 */

// Base Event Types
export * from './base-event';

// Real-time Update Events (P2-EVT-001)
export * from './realtime-events';

// Calculation Trigger Events (P2-EVT-002)
export * from './calculation-events';

// Layout Validation Trigger Events (P2-EVT-003)
export * from './layout-events';
