/**
 * Project State Machine
 * @module types/state-machines/project-state-machine
 * @see PRD §11 Phase 2 State Machines
 * @requirement P2-STA-001
 */

import type { ProjectStatus } from '../enums';

// ============================================================================
// State Definitions
// ============================================================================

/**
 * Project state (alias for ProjectStatus for clarity in state machine context)
 */
export type ProjectState = ProjectStatus;

/**
 * All valid project states
 */
export const PROJECT_STATES: readonly ProjectState[] = [
  'draft',
  'active',
  'completed',
  'archived',
] as const;

// ============================================================================
// Transition Definitions
// ============================================================================

/**
 * Valid state transitions for projects
 * Key = current state, Value = array of allowed next states
 */
export const PROJECT_TRANSITIONS: Record<ProjectState, readonly ProjectState[]> = {
  draft: ['active', 'archived'],
  active: ['completed', 'archived'],
  completed: ['archived', 'active'], // Allow reactivation
  archived: ['draft'], // Allow unarchive to draft for editing
} as const;

/**
 * Transition event names for project state changes
 */
export type ProjectTransitionEvent =
  | 'ACTIVATE' // draft → active
  | 'COMPLETE' // active → completed
  | 'ARCHIVE' // any → archived
  | 'REACTIVATE' // completed → active
  | 'UNARCHIVE'; // archived → draft

/**
 * Mapping of transition events to their target states
 */
export const PROJECT_TRANSITION_EVENTS: Record<ProjectTransitionEvent, ProjectState> = {
  ACTIVATE: 'active',
  COMPLETE: 'completed',
  ARCHIVE: 'archived',
  REACTIVATE: 'active',
  UNARCHIVE: 'draft',
} as const;

// ============================================================================
// Transition Result Types
// ============================================================================

/**
 * Successful state transition result
 */
export interface ProjectTransitionSuccess {
  success: true;
  fromState: ProjectState;
  toState: ProjectState;
  event: ProjectTransitionEvent;
}

/**
 * Failed state transition result
 */
export interface ProjectTransitionFailure {
  success: false;
  fromState: ProjectState;
  attemptedState: ProjectState;
  reason: string;
  allowedTransitions: readonly ProjectState[];
}

/**
 * State transition result
 */
export type ProjectTransitionResult = ProjectTransitionSuccess | ProjectTransitionFailure;

// ============================================================================
// Transition Functions
// ============================================================================

/**
 * Check if a state transition is valid
 */
export function canTransitionProject(
  currentState: ProjectState,
  targetState: ProjectState
): boolean {
  return PROJECT_TRANSITIONS[currentState].includes(targetState);
}

/**
 * Get allowed transitions from current state
 */
export function getAllowedProjectTransitions(currentState: ProjectState): readonly ProjectState[] {
  return PROJECT_TRANSITIONS[currentState];
}

/**
 * Attempt a state transition
 */
export function transitionProject(
  currentState: ProjectState,
  targetState: ProjectState,
  event: ProjectTransitionEvent
): ProjectTransitionResult {
  if (canTransitionProject(currentState, targetState)) {
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
    allowedTransitions: PROJECT_TRANSITIONS[currentState],
  };
}

/**
 * Get the transition event for a state change
 */
export function getProjectTransitionEvent(
  fromState: ProjectState,
  toState: ProjectState
): ProjectTransitionEvent | null {
  if (fromState === 'draft' && toState === 'active') return 'ACTIVATE';
  if (fromState === 'active' && toState === 'completed') return 'COMPLETE';
  if (toState === 'archived') return 'ARCHIVE';
  if (fromState === 'completed' && toState === 'active') return 'REACTIVATE';
  if (fromState === 'archived' && toState === 'draft') return 'UNARCHIVE';
  return null;
}
