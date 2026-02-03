/**
 * Calculation State Machine
 * @module types/state-machines/calculation-state-machine
 * @see PRD §11 Phase 2 State Machines
 * @requirement P2-STA-002
 */

import type { CalculationStatus } from '../enums';

// ============================================================================
// State Definitions
// ============================================================================

/**
 * Calculation state (alias for CalculationStatus for clarity)
 */
export type CalculationState = CalculationStatus;

/**
 * All valid calculation states
 */
export const CALCULATION_STATES: readonly CalculationState[] = [
  'pending',
  'processing',
  'completed',
  'error',
] as const;

// ============================================================================
// Transition Definitions
// ============================================================================

/**
 * Valid state transitions for calculations
 * Key = current state, Value = array of allowed next states
 */
export const CALCULATION_TRANSITIONS: Record<CalculationState, readonly CalculationState[]> = {
  pending: ['processing', 'error'],
  processing: ['completed', 'error'],
  completed: ['pending'], // Allow recalculation
  error: ['pending'], // Allow retry
} as const;

/**
 * Transition event names for calculation state changes
 */
export type CalculationTransitionEvent =
  | 'START' // pending → processing
  | 'COMPLETE' // processing → completed
  | 'FAIL' // any → error
  | 'RETRY' // error → pending
  | 'RECALCULATE'; // completed → pending

/**
 * Mapping of transition events to their target states
 */
export const CALCULATION_TRANSITION_EVENTS: Record<CalculationTransitionEvent, CalculationState> = {
  START: 'processing',
  COMPLETE: 'completed',
  FAIL: 'error',
  RETRY: 'pending',
  RECALCULATE: 'pending',
} as const;

// ============================================================================
// Transition Result Types
// ============================================================================

/**
 * Successful state transition result
 */
export interface CalculationTransitionSuccess {
  success: true;
  fromState: CalculationState;
  toState: CalculationState;
  event: CalculationTransitionEvent;
}

/**
 * Failed state transition result
 */
export interface CalculationTransitionFailure {
  success: false;
  fromState: CalculationState;
  attemptedState: CalculationState;
  reason: string;
  allowedTransitions: readonly CalculationState[];
}

/**
 * State transition result
 */
export type CalculationTransitionResult =
  | CalculationTransitionSuccess
  | CalculationTransitionFailure;

// ============================================================================
// Transition Functions
// ============================================================================

/**
 * Check if a state transition is valid
 */
export function canTransitionCalculation(
  currentState: CalculationState,
  targetState: CalculationState
): boolean {
  return CALCULATION_TRANSITIONS[currentState].includes(targetState);
}

/**
 * Get allowed transitions from current state
 */
export function getAllowedCalculationTransitions(
  currentState: CalculationState
): readonly CalculationState[] {
  return CALCULATION_TRANSITIONS[currentState];
}

/**
 * Attempt a state transition
 */
export function transitionCalculation(
  currentState: CalculationState,
  targetState: CalculationState,
  event: CalculationTransitionEvent
): CalculationTransitionResult {
  if (canTransitionCalculation(currentState, targetState)) {
    return {
      success: true,
      fromState: currentState,
      toState: targetState,
      event,
    };
  }

  return {
    success: false,
    fromState: currentState,
    attemptedState: targetState,
    reason: `Cannot transition from '${currentState}' to '${targetState}'`,
    allowedTransitions: CALCULATION_TRANSITIONS[currentState],
  };
}

/**
 * Get the transition event for a state change
 */
export function getCalculationTransitionEvent(
  fromState: CalculationState,
  toState: CalculationState
): CalculationTransitionEvent | null {
  if (fromState === 'pending' && toState === 'processing') return 'START';
  if (fromState === 'processing' && toState === 'completed') return 'COMPLETE';
  if (toState === 'error') return 'FAIL';
  if (fromState === 'error' && toState === 'pending') return 'RETRY';
  if (fromState === 'completed' && toState === 'pending') return 'RECALCULATE';
  return null;
}

/**
 * Check if calculation is in a terminal state (needs user action to proceed)
 */
export function isCalculationTerminal(state: CalculationState): boolean {
  return state === 'completed' || state === 'error';
}

/**
 * Check if calculation is in progress
 */
export function isCalculationInProgress(state: CalculationState): boolean {
  return state === 'pending' || state === 'processing';
}
