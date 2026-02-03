/**
 * User entity
 * @module types/entities/user
 * @see PRD §7.1 - users table
 * @requirement P2-ENT-008
 */

import type { UserRole } from '../enums';

// ============================================================================
// Preferences Types
// ============================================================================

/**
 * User preference settings
 */
export interface UserPreferences {
  /** Preferred theme */
  theme?: 'light' | 'dark' | 'system';
  /** Preferred language */
  language?: string;
  /** Default dashboard layout */
  defaultDashboardId?: string;
  /** Notification settings */
  notifications?: {
    email?: boolean;
    inApp?: boolean;
  };
  /** UI density preference */
  density?: 'compact' | 'normal' | 'comfortable';
}

// ============================================================================
// User Entity
// ============================================================================

/**
 * User - Application user within an organization
 */
export interface User {
  /** Unique identifier (UUID, linked to auth.users) */
  id: string;

  /** Associated organization */
  organizationId: string;

  /** User role for access control */
  role: UserRole;

  /** User preferences */
  preferences: UserPreferences;

  /** Account creation timestamp */
  createdAt: Date;

  /** User email (from auth) */
  email?: string;

  /** Display name */
  displayName?: string;

  /** Avatar URL */
  avatarUrl?: string;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Update user profile input
 */
export interface UpdateUserInput {
  displayName?: string;
  avatarUrl?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * Update user role input (admin only)
 */
export interface UpdateUserRoleInput {
  userId: string;
  role: UserRole;
}
