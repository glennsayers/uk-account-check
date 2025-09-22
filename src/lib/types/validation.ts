/**
 * Represents a validation error for invalid input data.
 */
export interface ValidationError {
  field: "sortCode" | "accountNumber";
  code: string;
  message: string;
}

/**
 * Result of an individual modulus check performed during validation.
 */
export interface CheckResult {
  method: "MOD10" | "MOD11" | "DBLAL";
  exception?: number;
  passed: boolean;
  details?: {
    calculatedRemainder: number;
    expectedRemainder: number;
    weightings: Record<string, number>;
  };
}

/**
 * Indicates the type and outcome of the validation process.
 * @since 1.0.0
 */
export enum ValidationStatus {
  VALIDATED_PASSED = "VALIDATED_PASSED",
  ASSUMED_VALID_NO_CHECKS = "ASSUMED_VALID_NO_CHECKS",
  VALIDATED_FAILED = "VALIDATED_FAILED",
  INVALID_INPUT = "INVALID_INPUT",
}

export interface ValidationResult {
  isValid: boolean;
  validationStatus: ValidationStatus;

  input: {
    originalSortCode: string;
    originalAccountNumber: string;
    sanitizedSortCode: string;
    sanitizedAccountNumber: string;
    transformationApplied?: string;
  };

  errors?: ValidationError[];

  checks: CheckResult[];

  summary: {
    totalChecks: number;
    checksPerformed: boolean;
  };
}
