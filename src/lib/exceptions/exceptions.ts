import type { ModulusCheckMethods } from "@/lib/constants/constants";
import type { Weightings } from "@/lib/modulusChecks/standardCheck";
import type { WeightMap } from "@/lib/sortCode/valacdos";

export type ResultsPredicate = (
  results: boolean[],
  contexts: ModulusCheckContext[]
) => boolean;
export interface ModulusCheckContext {
  sortCode: string;
  accountNumber: string;
  weightings: Weightings;
  modulusValue: number;
  modulusMethod: ModulusCheckMethods;
  exception?: number;
  checkNumber: number; // 1st or 2nd check (1-based)
}

/**
 * Interface for exception handlers
 * Each exception type implements this interface
 */
export interface ExceptionHandler {
  /**
   * Apply the exception logic to the context
   * Returns a modified context with exception rules applied
   */
  apply(context: ModulusCheckContext): ModulusCheckContext;

  /**
   * Determine if this handler should be applied for the given exception number
   */
  shouldApply(exception: number): boolean;

  /**
   * Optional: Return a human-readable description of what this exception does
   */
  getDescription?(): string;

  validateResult?(
    modulusResult: number,
    finalModulusValue: number,
    context: ModulusCheckContext
  ): boolean;

  /**
   * Optionally return a custom result predicate
   */
  getResultPredicate?(): ResultsPredicate;
}
export const determineResultPredicate = (
  modulusWeightingChecks: WeightMap[]
): ResultsPredicate => {
  /**
   * Exceptions 10 and 11 for the first and second check
   * require that only 1 of them checks pass
   */
  if (
    modulusWeightingChecks[0].exception === 10 &&
    modulusWeightingChecks[1].exception === 11
  ) {
    return (results) => results.some(Boolean);
  }

  return (results) => results.every(Boolean);
};
