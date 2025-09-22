import {
  sanitizeAccountNumber,
  transformNonStandardAccountNumbers,
} from "@/lib/accountNumber/account-number";
import { createModulusCheckContext } from "@/lib/exceptions/context";
import type { ModulusCheckContext } from "@/lib/exceptions/exceptions";
import { exceptionRegistry } from "@/lib/exceptions/registry";
import { performStandardCheck } from "@/lib/modulusChecks/standardCheck";
import { sanitizeSortCode } from "@/lib/sortCode/sort-code";
import { getModulusWeights } from "@/lib/sortCode/valacdos";
import {
  type CheckResult,
  type ValidationResult,
  ValidationStatus,
} from "@/lib/types/validation";
import {
  validateAccountNumber,
  validateSortCode,
} from "@/lib/validation/inputValidation";

// Define a type for the object parameter for reusability
type BankDetails = {
  sortCode: string;
  accountNumber: string;
};
export function verifyBankAccount(details: BankDetails): ValidationResult;

export function verifyBankAccount(
  sortCode: string,
  accountNumber: string
): ValidationResult;

// 3. The actual implementation with a compatible signature
export function verifyBankAccount(
  arg1: string | BankDetails,
  arg2?: string
): ValidationResult {
  let sortCode: string;
  let accountNumber: string;

  // Check which overload was used and assign variables
  if (typeof arg1 === "object" && arg1 !== null) {
    // This handles the verifyBankAccount({ sortCode: '...', accountNumber: '...' }) case
    sortCode = arg1.sortCode;
    accountNumber = arg1.accountNumber;
  } else {
    // This handles the verifyBankAccount('...', '...') case
    sortCode = arg1;
    accountNumber = arg2 as string; // We can assert 'arg2' is a string here
  }
  const sortCodeErrors = validateSortCode(sortCode);
  const accountNumberErrors = validateAccountNumber(accountNumber);
  const allErrors = [...sortCodeErrors, ...accountNumberErrors];

  if (allErrors.length > 0) {
    return {
      isValid: false,
      validationStatus: ValidationStatus.INVALID_INPUT,
      input: {
        originalSortCode: sortCode,
        originalAccountNumber: accountNumber,
        sanitizedSortCode: "",
        sanitizedAccountNumber: "",
      },
      errors: allErrors,
      checks: [],
      summary: {
        totalChecks: 0,
        checksPerformed: false,
      },
    };
  }

  // Sanitize and transform inputs
  const sanitizedSortCode = sanitizeSortCode(sortCode);
  const sanitizedAccountNumber = sanitizeAccountNumber(accountNumber);

  const {
    accountNumber: standardisedAccountNumber,
    sortCode: standardisedSortCode,
  } = transformNonStandardAccountNumbers(
    sanitizedAccountNumber,
    sanitizedSortCode
  );

  // Detect transformation
  let transformationApplied: string | undefined;
  if (sanitizedAccountNumber.length === 10) {
    transformationApplied = standardisedSortCode.startsWith("01")
      ? "10-digit NatWest (last 8 digits used)"
      : "10-digit Co-op/Leeds (first 8 digits used)";
  } else if (sanitizedAccountNumber.length === 9) {
    transformationApplied = "9-digit account (8 digits used)";
  } else if (sanitizedAccountNumber.length === 7) {
    transformationApplied = "7-digit account (prefixed with 0)";
  } else if (sanitizedAccountNumber.length === 6) {
    transformationApplied = "6-digit account (prefixed with 00)";
  }

  // Get modulus weights
  const modulusWeightRecords = getModulusWeights(standardisedSortCode);
  const hasWeightRecords = modulusWeightRecords.length > 0;

  // If no records, assume valid per specification
  if (!hasWeightRecords) {
    return {
      isValid: true,
      validationStatus: ValidationStatus.ASSUMED_VALID_NO_CHECKS,
      input: {
        originalSortCode: sortCode,
        originalAccountNumber: accountNumber,
        sanitizedSortCode,
        sanitizedAccountNumber: standardisedAccountNumber,
        transformationApplied,
      },
      checks: [],
      summary: {
        totalChecks: 0,
        checksPerformed: false,
      },
    };
  }

  // Perform modulus checks
  const resultsPredicate =
    exceptionRegistry.getResultPredicate(modulusWeightRecords);

  const contexts: ModulusCheckContext[] = [];

  const checkResults: CheckResult[] = modulusWeightRecords.map(
    (weightRecord, index) => {
      const context = createModulusCheckContext(
        standardisedSortCode,
        standardisedAccountNumber,
        weightRecord,
        index + 1
      );

      const modifiedContext = exceptionRegistry.applyExceptions(
        context,
        modulusWeightRecords
      );

      contexts.push(modifiedContext);

      return performStandardCheck(modifiedContext);
    }
  );

  // Determine overall result
  const checksPassed = checkResults.map((result) => result.passed);
  const isValid = resultsPredicate(checksPassed, contexts);

  return {
    isValid,
    validationStatus: isValid
      ? ValidationStatus.VALIDATED_PASSED
      : ValidationStatus.VALIDATED_FAILED,
    input: {
      originalSortCode: sortCode,
      originalAccountNumber: accountNumber,
      sanitizedSortCode,
      sanitizedAccountNumber: standardisedAccountNumber,
      transformationApplied,
    },
    checks: checkResults,
    summary: {
      totalChecks: checkResults.length,
      checksPerformed: true,
    },
  };
}
