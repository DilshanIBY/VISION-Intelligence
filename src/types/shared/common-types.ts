/**
 * Common utility types shared between frontend and backend
 * @module types/shared/common-types
 * @see PRD §11 Phase 2
 * @requirement P2-TYP-001
 */

// ============================================================================
// Base Type Aliases
// ============================================================================

/**
 * UUID type alias for clarity
 * Note: If you need the Zod UUID schema, use uuidSchema from validation/common-schemas
 */
export type UUIDType = string;

/**
 * ISO 8601 date string type
 */
export type ISODateString = string;

/**
 * Timestamp that can be Date object or ISO string
 */
export type Timestamp = Date | ISODateString;

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Makes all properties of T deeply partial
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * Makes type T accept null values
 */
export type Nullable<T> = T | null;

/**
 * Makes type T optional (can be undefined)
 */
export type Optional<T> = T | undefined;

/**
 * Makes specific keys of T required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specific keys of T optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extracts keys of T that have values of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Makes type readonly recursively
 */
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends object
    ? DeepReadonlyObject<T>
    : T;

type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;
type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

// ============================================================================
// Record Types
// ============================================================================

/**
 * Generic key-value store type
 */
export type Dictionary<T = unknown> = Record<string, T>;

/**
 * Record with optional values
 */
export type PartialRecord<K extends string | number | symbol, V> = {
  [P in K]?: V;
};

/**
 * JSON-serializable value type
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * JSON object type
 */
export type JsonObject = { [key: string]: JsonValue };

// ============================================================================
// Function Types
// ============================================================================

/**
 * Generic async function type
 */
export type AsyncFunction<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TArgs
) => Promise<TReturn>;

/**
 * Generic callback type
 */
export type Callback<T = void> = (value: T) => void;

/**
 * Error-first callback type (Node.js style)
 */
export type ErrorCallback<T = void> = (error: Error | null, value?: T) => void;

// ============================================================================
// Result Types (for error handling)
// ============================================================================

/**
 * Success result
 */
export interface Success<T> {
  success: true;
  data: T;
}

/**
 * Failure result
 */
export interface Failure<E = Error> {
  success: false;
  error: E;
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Create a success result
 */
export function success<T>(data: T): Success<T> {
  return { success: true, data };
}

/**
 * Create a failure result
 */
export function failure<E = Error>(error: E): Failure<E> {
  return { success: false, error };
}

/**
 * Check if result is success
 */
export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
  return result.success === true;
}

/**
 * Check if result is failure
 */
export function isFailure<T, E>(result: Result<T, E>): result is Failure<E> {
  return result.success === false;
}

// ============================================================================
// Brand Types (for type-safe IDs)
// ============================================================================

/**
 * Brand type for creating nominal types
 */
declare const __brand: unique symbol;
export type Brand<T, TBrand> = T & { [__brand]: TBrand };

/**
 * Branded UUID types for type-safe entity references
 */
export type ProjectId = Brand<string, 'ProjectId'>;
export type CalculationId = Brand<string, 'CalculationId'>;
export type ScenarioId = Brand<string, 'ScenarioId'>;
export type FloorLayoutId = Brand<string, 'FloorLayoutId'>;
export type DashboardId = Brand<string, 'DashboardId'>;
export type OrganizationId = Brand<string, 'OrganizationId'>;
export type UserId = Brand<string, 'UserId'>;

// ============================================================================
// Event Types
// ============================================================================

/**
 * Generic event handler type for shared use
 * Note: For domain-specific event handlers, use EventHandler from events module
 */
export type GenericEventHandler<T = void> = (event: T) => void | Promise<void>;

/**
 * Event subscription cleanup function
 */
export type Unsubscribe = () => void;

/**
 * Event emitter subscribe function
 */
export type Subscribe<T> = (handler: GenericEventHandler<T>) => Unsubscribe;
