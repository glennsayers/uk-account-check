import { sanitizeSortCode } from "@/lib/sortCode/sort-code";
import type { ValidationError } from "@/lib/types/validation";

export function validateSortCode(sortCode: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!sortCode || sortCode.trim() === "") {
    errors.push({
      field: "sortCode",
      code: "EMPTY_INPUT",
      message: "Sort code cannot be empty",
    });
    return errors;
  }

  const cleaned = sanitizeSortCode(sortCode);

  if (!/^\d+$/.test(cleaned)) {
    errors.push({
      field: "sortCode",
      code: "NON_NUMERIC",
      message:
        "Sort code must contain only numeric characters (and optional hyphens/spaces)",
    });
  }

  if (cleaned.length !== 6) {
    errors.push({
      field: "sortCode",
      code: "INVALID_LENGTH",
      message: `Sort code must be exactly 6 digits, got ${cleaned.length}`,
    });
  }

  return errors;
}

export function validateAccountNumber(
  accountNumber: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!accountNumber || accountNumber.trim() === "") {
    errors.push({
      field: "accountNumber",
      code: "EMPTY_INPUT",
      message: "Account number cannot be empty",
    });
    return errors;
  }

  const cleaned = accountNumber.trim().replace(/[-\s]/g, "");

  if (!/^\d+$/.test(cleaned)) {
    errors.push({
      field: "accountNumber",
      code: "NON_NUMERIC",
      message:
        "Account number must contain only numeric characters (and optional hyphens/spaces)",
    });
  }

  if (cleaned.length < 6 || cleaned.length > 10) {
    errors.push({
      field: "accountNumber",
      code: "INVALID_LENGTH",
      message: `Account number must be 6-10 digits, got ${cleaned.length}`,
    });
  }

  return errors;
}
