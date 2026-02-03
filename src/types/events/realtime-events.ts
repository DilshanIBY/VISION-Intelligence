/**
 * Real-time Update Events
 * @module types/events/realtime-events
 * @see PRD §5.4, §11 Phase 2
 * @requirement P2-EVT-001
 */

import type { BaseEvent, EntityType, CrudEventType } from './base-event';
import type { ProjectStatus, CalculationStatus, LayoutStatus } from '../enums';

// ============================================================================
// Generic Entity Update Events
// ============================================================================

/**
 * Payload for entity update events
 */
export interface EntityUpdatePayload<T = unknown> {
    /** Entity type */
    entityType: EntityType;

    /** Entity ID */
    entityId: string;

    /** CRUD operation type */
    operation: CrudEventType;

    /** Updated entity data (partial for updates) */
    data?: Partial<T>;

    /** Changed fields (for updates) */
    changedFields?: string[];
}

/**
 * Generic entity update event
 */
export type EntityUpdateEvent<T = unknown> = BaseEvent<
    'entity:update',
    EntityUpdatePayload<T>
>;

// ============================================================================
// Project Events
// ============================================================================

/**
 * Project update payload
 */
export interface ProjectUpdatePayload {
    projectId: string;
    operation: CrudEventType;
    name?: string;
    status?: ProjectStatus;
    changedFields?: string[];
}

/**
 * Project created event
 */
export type ProjectCreatedEvent = BaseEvent<'project:created', {
    projectId: string;
    name: string;
    organizationId: string;
}>;

/**
 * Project updated event
 */
export type ProjectUpdatedEvent = BaseEvent<'project:updated', ProjectUpdatePayload>;

/**
 * Project deleted event
 */
export type ProjectDeletedEvent = BaseEvent<'project:deleted', {
    projectId: string;
}>;

/**
 * Project status changed event
 */
export type ProjectStatusChangedEvent = BaseEvent<'project:status_changed', {
    projectId: string;
    fromStatus: ProjectStatus;
    toStatus: ProjectStatus;
}>;

// ============================================================================
// Calculation Events (Real-time)
// ============================================================================

/**
 * Calculation update payload
 */
export interface CalculationUpdatePayload {
    calculationId: string;
    projectId: string;
    operation: CrudEventType;
    status?: CalculationStatus;
    changedFields?: string[];
}

/**
 * Calculation created event
 */
export type CalculationCreatedEvent = BaseEvent<'calculation:created', {
    calculationId: string;
    projectId: string;
    type: 'machinery' | 'embroidery' | 'layout';
}>;

/**
 * Calculation updated event (general update)
 */
export type CalculationUpdatedEvent = BaseEvent<'calculation:updated', CalculationUpdatePayload>;

/**
 * Calculation deleted event
 */
export type CalculationDeletedEvent = BaseEvent<'calculation:deleted', {
    calculationId: string;
    projectId: string;
}>;

// ============================================================================
// Floor Layout Events (Real-time)
// ============================================================================

/**
 * Layout update payload
 */
export interface LayoutUpdatePayload {
    layoutId: string;
    projectId: string;
    operation: CrudEventType;
    status?: LayoutStatus;
    changedFields?: string[];
}

/**
 * Layout created event
 */
export type LayoutCreatedEvent = BaseEvent<'layout:created', {
    layoutId: string;
    projectId: string;
    name?: string;
}>;

/**
 * Layout updated event
 */
export type LayoutUpdatedEvent = BaseEvent<'layout:updated', LayoutUpdatePayload>;

/**
 * Layout deleted event
 */
export type LayoutDeletedEvent = BaseEvent<'layout:deleted', {
    layoutId: string;
    projectId: string;
}>;

// ============================================================================
// Dashboard Events (Real-time)
// ============================================================================

/**
 * Dashboard update payload
 */
export interface DashboardUpdatePayload {
    dashboardId: string;
    projectId?: string;
    operation: CrudEventType;
    changedFields?: string[];
}

/**
 * Dashboard created event
 */
export type DashboardCreatedEvent = BaseEvent<'dashboard:created', {
    dashboardId: string;
    projectId?: string;
    name: string;
}>;

/**
 * Dashboard updated event
 */
export type DashboardUpdatedEvent = BaseEvent<'dashboard:updated', DashboardUpdatePayload>;

/**
 * Dashboard deleted event
 */
export type DashboardDeletedEvent = BaseEvent<'dashboard:deleted', {
    dashboardId: string;
}>;

// ============================================================================
// Union Types
// ============================================================================

/**
 * All project-related real-time events
 */
export type ProjectRealtimeEvent =
    | ProjectCreatedEvent
    | ProjectUpdatedEvent
    | ProjectDeletedEvent
    | ProjectStatusChangedEvent;

/**
 * All calculation-related real-time events
 */
export type CalculationRealtimeEvent =
    | CalculationCreatedEvent
    | CalculationUpdatedEvent
    | CalculationDeletedEvent;

/**
 * All layout-related real-time events
 */
export type LayoutRealtimeEvent =
    | LayoutCreatedEvent
    | LayoutUpdatedEvent
    | LayoutDeletedEvent;

/**
 * All dashboard-related real-time events
 */
export type DashboardRealtimeEvent =
    | DashboardCreatedEvent
    | DashboardUpdatedEvent
    | DashboardDeletedEvent;

/**
 * All real-time events
 */
export type RealtimeEvent =
    | EntityUpdateEvent
    | ProjectRealtimeEvent
    | CalculationRealtimeEvent
    | LayoutRealtimeEvent
    | DashboardRealtimeEvent;

/**
 * Real-time event type strings
 */
export type RealtimeEventType = RealtimeEvent['type'];
