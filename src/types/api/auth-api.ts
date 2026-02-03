/**
 * Authentication and Users API contracts
 * @module types/api/auth-api
 * @see PRD §8.1 (implied), §7.1 users table
 * @requirement P2-API-006
 */

import type { ApiResponse } from './common';
import type { User } from '../entities/user';
import type { Organization } from '../entities/organization';
import type { UserRole } from '../enums';

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * Login request body
 */
export interface LoginRequest {
    /** User email */
    email: string;
    /** User password */
    password: string;
}

/**
 * Login response with session data
 */
export interface LoginResponse {
    /** Authenticated user */
    user: User;
    /** User's organization */
    organization: Organization;
    /** Access token */
    accessToken: string;
    /** Refresh token */
    refreshToken: string;
    /** Token expiration timestamp */
    expiresAt: string;
}

/**
 * Wrapped API response
 */
export type LoginApiResponse = ApiResponse<LoginResponse>;

// ============================================================================
// Logout
// ============================================================================

/**
 * Logout response
 */
export interface LogoutResponse {
    /** Whether logout was successful */
    success: boolean;
}

/**
 * Wrapped API response
 */
export type LogoutApiResponse = ApiResponse<LogoutResponse>;

// ============================================================================
// Token Refresh
// ============================================================================

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
    /** Refresh token */
    refreshToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
    /** New access token */
    accessToken: string;
    /** New refresh token */
    refreshToken: string;
    /** Token expiration timestamp */
    expiresAt: string;
}

/**
 * Wrapped API response
 */
export type RefreshTokenApiResponse = ApiResponse<RefreshTokenResponse>;

// ============================================================================
// User Profile
// ============================================================================

/**
 * Get current user profile response
 */
export interface GetProfileResponse {
    /** Current user */
    user: User;
    /** User's organization */
    organization: Organization;
}

/**
 * Wrapped API response
 */
export type GetProfileApiResponse = ApiResponse<GetProfileResponse>;

/**
 * Update user profile request
 */
export interface UpdateProfileRequest {
    /** User preferences */
    preferences?: Record<string, unknown>;
}

/**
 * Update profile response
 */
export interface UpdateProfileResponse {
    /** Updated user */
    user: User;
}

/**
 * Wrapped API response
 */
export type UpdateProfileApiResponse = ApiResponse<UpdateProfileResponse>;

// ============================================================================
// User Management (Admin)
// ============================================================================

/**
 * Create user request (admin only)
 */
export interface CreateUserRequest {
    /** User email */
    email: string;
    /** User role */
    role: UserRole;
    /** Initial password (optional, can be set via invite) */
    password?: string;
}

/**
 * Create user response
 */
export interface CreateUserResponse {
    /** Created user */
    user: User;
    /** Invite link (if password not provided) */
    inviteLink?: string;
}

/**
 * Wrapped API response
 */
export type CreateUserApiResponse = ApiResponse<CreateUserResponse>;

/**
 * Update user request
 */
export interface UpdateUserRequest {
    /** User role */
    role?: UserRole;
    /** User preferences */
    preferences?: Record<string, unknown>;
}

/**
 * Update user response
 */
export interface UpdateUserResponse {
    /** Updated user */
    user: User;
}

/**
 * Wrapped API response
 */
export type UpdateUserApiResponse = ApiResponse<UpdateUserResponse>;

/**
 * Delete user response
 */
export interface DeleteUserResponse {
    /** Deleted user ID */
    deletedId: string;
}

/**
 * Wrapped API response
 */
export type DeleteUserApiResponse = ApiResponse<DeleteUserResponse>;

// ============================================================================
// Password Management
// ============================================================================

/**
 * Change password request
 */
export interface ChangePasswordRequest {
    /** Current password */
    currentPassword: string;
    /** New password */
    newPassword: string;
}

/**
 * Change password response
 */
export interface ChangePasswordResponse {
    /** Success indicator */
    success: boolean;
}

/**
 * Wrapped API response
 */
export type ChangePasswordApiResponse = ApiResponse<ChangePasswordResponse>;

/**
 * Request password reset
 */
export interface RequestPasswordResetRequest {
    /** User email */
    email: string;
}

/**
 * Request password reset response
 */
export interface RequestPasswordResetResponse {
    /** Success indicator (always true for security) */
    success: boolean;
    /** Message to display */
    message: string;
}

/**
 * Wrapped API response
 */
export type RequestPasswordResetApiResponse = ApiResponse<RequestPasswordResetResponse>;

/**
 * Reset password with token
 */
export interface ResetPasswordRequest {
    /** Reset token */
    token: string;
    /** New password */
    newPassword: string;
}

/**
 * Reset password response
 */
export interface ResetPasswordResponse {
    /** Success indicator */
    success: boolean;
}

/**
 * Wrapped API response
 */
export type ResetPasswordApiResponse = ApiResponse<ResetPasswordResponse>;
