/**
 * FloorLayout State Machine
 * @module types/state-machines/layout-state-machine
 * @see PRD §11 Phase 2 State Machines
 * @requirement P2-STA-003
 */

import type { LayoutStatus } from '../enums';

// ============================================================================
// State Definitions
// ============================================================================

/**
 * Layout state (alias for LayoutStatus for clarity)
 */
export type LayoutState = LayoutStatus;

/**
 * All valid layout states
 */
export const LAYOUT_STATES: readonly LayoutState[] = [
    'editing',
    'validated',
    'exported'
] as const;

// ============================================================================
// Transition Definitions
// ============================================================================

/**
 * Valid state transitions for floor layouts
 * Key = current state, Value = array of allowed next states
 */
export const LAYOUT_TRANSITIONS: Record<LayoutState, readonly LayoutState[]> = {
    editing: ['validated'],
    validated: ['exported', 'editing'], // Can go back to editing
    exported: ['editing', 'validated'] // Can re-edit or re-validate
} as const;

/**
 * Transition event names for layout state changes
 */
export type LayoutTransitionEvent =
    | 'VALIDATE'      // editing → validated
    | 'EXPORT'        // validated → exported
    | 'EDIT'          // any → editing
    | 'REVALIDATE';   // exported → validated

/**
 * Mapping of transition events to their target states
 */
export const LAYOUT_TRANSITION_EVENTS: Record<LayoutTransitionEvent, LayoutState> = {
    VALIDATE: 'validated',
    EXPORT: 'exported',
    EDIT: 'editing',
    REVALIDATE: 'validated'
} as const;

// ============================================================================
// Transition Result Types
// ============================================================================

/**
 * Successful state transition result
 */
export interface LayoutTransitionSuccess {
    success: true;
    fromState: LayoutState;
    toState: LayoutState;
    event: LayoutTransitionEvent;
}

/**
 * Failed state transition result
 */
export interface LayoutTransitionFailure {
    success: false;
    fromState: LayoutState;
    attemptedState: LayoutState;
    reason: string;
    allowedTransitions: readonly LayoutState[];
}

/**
 * State transition result
 */
export type LayoutTransitionResult = LayoutTransitionSuccess | LayoutTransitionFailure;

// ============================================================================
// Transition Functions
// ============================================================================

/**
 * Check if a state transition is valid
 */
export function canTransitionLayout(
    currentState: LayoutState,
    targetState: LayoutState
): boolean {
    return LAYOUT_TRANSITIONS[currentState].includes(targetState);
}

/**
 * Get allowed transitions from current state
 */
export function getAllowedLayoutTransitions(
    currentState: LayoutState
): readonly LayoutState[] {
    return LAYOUT_TRANSITIONS[currentState];
}

/**
 * Attempt a state transition
 */
export function transitionLayout(
    currentState: LayoutState,
    targetState: LayoutState,
    event: LayoutTransitionEvent
): LayoutTransitionResult {
    if (canTransitionLayout(currentState, targetState)) {
        return {
            success: true,
            fromState: currentState,
            toState: targetState,
            event
        };
    }

    return {
        success: false,
        fromState: currentState,
        attemptedState: targetState,
        reason: `Cannot transition from '${currentState}' to '${targetState}'`,
        allowedTransitions: LAYOUT_TRANSITIONS[currentState]
    };
}

/**
 * Get the transition event for a state change
 */
export function getLayoutTransitionEvent(
    fromState: LayoutState,
    toState: LayoutState
): LayoutTransitionEvent | null {
    if (fromState === 'editing' && toState === 'validated') return 'VALIDATE';
    if (fromState === 'validated' && toState === 'exported') return 'EXPORT';
    if (toState === 'editing') return 'EDIT';
    if (fromState === 'exported' && toState === 'validated') return 'REVALIDATE';
    return null;
}

/**
 * Check if layout can be exported (must be validated first)
 */
export function canExportLayout(state: LayoutState): boolean {
    return state === 'validated' || state === 'exported';
}

/**
 * Check if layout requires validation (has been edited)
 */
export function requiresValidation(state: LayoutState): boolean {
    return state === 'editing';
}
