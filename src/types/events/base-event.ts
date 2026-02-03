/**
 * Base Event Definitions
 * @module types/events/base-event
 * @see PRD §5.4, §11 Phase 2
 * @requirement P2-EVT-001
 */

// ============================================================================
// Event Metadata
// ============================================================================

/**
 * Event source identifiers
 */
export type EventSource =
  | 'client' // Originated from user action
  | 'server' // Originated from server/backend
  | 'realtime' // Originated from Supabase Realtime
  | 'system'; // Originated from system process

/**
 * Metadata attached to all events
 */
export interface EventMetadata {
  /** Event creation timestamp */
  timestamp: Date;

  /** User who triggered the event (if applicable) */
  userId?: string;

  /** Organization context */
  organizationId?: string;

  /** Event source */
  source: EventSource;

  /** Correlation ID for tracking related events */
  correlationId?: string;

  /** Session ID for tracking user session */
  sessionId?: string;
}

// ============================================================================
// Base Event Interface
// ============================================================================

/**
 * Base event interface - all events extend this
 * @template T - Event type string literal
 * @template P - Event payload type
 */
export interface BaseEvent<T extends string, P = unknown> {
  /** Unique event identifier */
  id: string;

  /** Event type identifier */
  type: T;

  /** Event payload data */
  payload: P;

  /** Event metadata */
  metadata: EventMetadata;
}

// ============================================================================
// Event Categories
// ============================================================================

/**
 * Entity types that can have events
 */
export type EntityType =
  | 'project'
  | 'calculation'
  | 'scenario'
  | 'floor_layout'
  | 'dashboard'
  | 'dashboard_widget'
  | 'user';

/**
 * Standard CRUD event types
 */
export type CrudEventType = 'created' | 'updated' | 'deleted';

/**
 * Entity reference in event payloads
 */
export interface EntityReference {
  /** Entity type */
  entityType: EntityType;

  /** Entity ID */
  entityId: string;

  /** Optional entity name/label */
  entityName?: string;
}

// ============================================================================
// Event Handler Types
// ============================================================================

/**
 * Event handler function type
 */
export type EventHandler<E extends BaseEvent<string, unknown>> = (event: E) => void | Promise<void>;

/**
 * Event subscription
 */
export interface EventSubscription {
  /** Unique subscription ID */
  id: string;

  /** Event type(s) subscribed to */
  eventTypes: string[];

  /** Handler function */
  handler: EventHandler<BaseEvent<string, unknown>>;

  /** Unsubscribe function */
  unsubscribe: () => void;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Extract payload type from event
 */
export type EventPayload<E extends BaseEvent<string, unknown>> = E['payload'];

/**
 * Extract event type from event
 */
export type EventType<E extends BaseEvent<string, unknown>> = E['type'];

/**
 * Create event metadata factory
 */
export function createEventMetadata(
  source: EventSource,
  userId?: string,
  organizationId?: string
): EventMetadata {
  return {
    timestamp: new Date(),
    source,
    userId,
    organizationId,
  };
}
