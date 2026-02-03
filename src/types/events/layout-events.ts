/**
 * Layout Validation Trigger Events
 * @module types/events/layout-events
 * @see PRD §3.2, §5.2, §11 Phase 2
 * @requirement P2-EVT-003
 */

import type { BaseEvent } from './base-event';
import type { LayoutStatus, ValidationStatus, ValidationSeverity, DepartmentType } from '../enums';
import type { Position, Dimensions, LayoutValidation } from '../entities/floor-layout';

// ============================================================================
// Layout Lifecycle Events
// ============================================================================

/**
 * Layout editing started event
 */
export type LayoutEditingStartedEvent = BaseEvent<'layout:editing_started', {
    layoutId: string;
    projectId: string;
}>;

/**
 * Layout saved event
 */
export type LayoutSavedEvent = BaseEvent<'layout:saved', {
    layoutId: string;
    projectId: string;
    name?: string;
    status: LayoutStatus;
}>;

// ============================================================================
// Validation Events
// ============================================================================

/**
 * Layout validation requested event - triggered when user requests validation
 */
export type LayoutValidationRequestedEvent = BaseEvent<'layout:validation_requested', {
    layoutId: string;
    projectId: string;
    triggeredBy: 'user' | 'auto' | 'export';
}>;

/**
 * Layout validation completed event - result of validation
 */
export type LayoutValidationCompletedEvent = BaseEvent<'layout:validation_completed', {
    layoutId: string;
    projectId: string;
    validation: LayoutValidation;
    previousStatus: ValidationStatus;
    newStatus: ValidationStatus;
    duration: number; // in milliseconds
}>;

/**
 * Layout validation failed event - validation process error
 */
export type LayoutValidationFailedEvent = BaseEvent<'layout:validation_failed', {
    layoutId: string;
    error: {
        code: string;
        message: string;
    };
}>;

// ============================================================================
// Department Events
// ============================================================================

/**
 * Department moved event
 */
export type DepartmentMovedEvent = BaseEvent<'layout:department_moved', {
    layoutId: string;
    departmentId: string;
    departmentType: DepartmentType;
    fromPosition: Position;
    toPosition: Position;
    triggerValidation: boolean;
}>;

/**
 * Department resized event
 */
export type DepartmentResizedEvent = BaseEvent<'layout:department_resized', {
    layoutId: string;
    departmentId: string;
    departmentType: DepartmentType;
    fromSize: Dimensions;
    toSize: Dimensions;
    triggerValidation: boolean;
}>;

/**
 * Department added event
 */
export type DepartmentAddedEvent = BaseEvent<'layout:department_added', {
    layoutId: string;
    departmentId: string;
    departmentType: DepartmentType;
    position: Position;
    size: Dimensions;
}>;

/**
 * Department removed event
 */
export type DepartmentRemovedEvent = BaseEvent<'layout:department_removed', {
    layoutId: string;
    departmentId: string;
    departmentType: DepartmentType;
}>;

// ============================================================================
// Bottleneck Events
// ============================================================================

/**
 * Bottleneck detected event
 */
export type BottleneckDetectedEvent = BaseEvent<'layout:bottleneck_detected', {
    layoutId: string;
    ruleId: string;
    severity: ValidationSeverity;
    departmentId: string;
    departmentType: DepartmentType;
    message: string;
    suggestion?: string;
}>;

/**
 * Bottleneck resolved event
 */
export type BottleneckResolvedEvent = BaseEvent<'layout:bottleneck_resolved', {
    layoutId: string;
    ruleId: string;
    departmentId: string;
}>;

/**
 * Flow efficiency changed event
 */
export type FlowEfficiencyChangedEvent = BaseEvent<'layout:flow_efficiency_changed', {
    layoutId: string;
    previousScore: number;
    newScore: number;
    threshold: number;
    status: 'improved' | 'degraded' | 'unchanged';
}>;

// ============================================================================
// Collision Events
// ============================================================================

/**
 * Collision detected event
 */
export type CollisionDetectedEvent = BaseEvent<'layout:collision_detected', {
    layoutId: string;
    departmentIds: [string, string];
    overlapArea: number;
}>;

/**
 * Collision resolved event
 */
export type CollisionResolvedEvent = BaseEvent<'layout:collision_resolved', {
    layoutId: string;
    departmentIds: [string, string];
}>;

// ============================================================================
// Export Events
// ============================================================================

/**
 * Layout export started event
 */
export type LayoutExportStartedEvent = BaseEvent<'layout:export_started', {
    layoutId: string;
    format: 'png' | 'pdf';
}>;

/**
 * Layout export completed event
 */
export type LayoutExportCompletedEvent = BaseEvent<'layout:export_completed', {
    layoutId: string;
    format: 'png' | 'pdf';
    filePath?: string;
    fileSize?: number;
}>;

/**
 * Layout export failed event
 */
export type LayoutExportFailedEvent = BaseEvent<'layout:export_failed', {
    layoutId: string;
    format: 'png' | 'pdf';
    error: {
        code: string;
        message: string;
    };
}>;

// ============================================================================
// Union Types
// ============================================================================

/**
 * All layout validation events
 */
export type LayoutValidationEvent =
    | LayoutValidationRequestedEvent
    | LayoutValidationCompletedEvent
    | LayoutValidationFailedEvent;

/**
 * All department events
 */
export type DepartmentEvent =
    | DepartmentMovedEvent
    | DepartmentResizedEvent
    | DepartmentAddedEvent
    | DepartmentRemovedEvent;

/**
 * All bottleneck/flow events
 */
export type BottleneckEvent =
    | BottleneckDetectedEvent
    | BottleneckResolvedEvent
    | FlowEfficiencyChangedEvent;

/**
 * All collision events
 */
export type CollisionEvent =
    | CollisionDetectedEvent
    | CollisionResolvedEvent;

/**
 * All export events
 */
export type LayoutExportEvent =
    | LayoutExportStartedEvent
    | LayoutExportCompletedEvent
    | LayoutExportFailedEvent;

/**
 * All layout trigger events
 */
export type LayoutTriggerEvent =
    | LayoutEditingStartedEvent
    | LayoutSavedEvent
    | LayoutValidationEvent
    | DepartmentEvent
    | BottleneckEvent
    | CollisionEvent
    | LayoutExportEvent;

/**
 * Layout event type strings
 */
export type LayoutEventType = LayoutTriggerEvent['type'];
