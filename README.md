# UK Account Check

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/glennsayers/uk-account-check/ci.yml?style=for-the-badge)
![NPM License](https://img.shields.io/npm/l/uk-account-check?style=for-the-badge)
![NPM Version](https://img.shields.io/npm/v/uk-account-check?style=for-the-badge)

A TypeScript library that implements the Vocalink Modulus Checking system to verify UK bank account details. This library validates UK bank account numbers using modulus checking algorithms against sort codes, following the official Vocalink specification used by UK banks.

This includes:

- All modulus checking methods (MOD10, MOD11, DBLAL)
- Complete exception handling (exceptions 1-14)
- Up-to-date Vocalink data file

This library currently implements v8.50 (23rd June 2025) of the [Vocalink Modulus Checking spec](https://www.vocalink.com/media/vu1advew/validating-account-numbers-uk-modulus-checking-v850.pdf), with all official exceptions covered. This will be kept up to date as new versions are published.

The specification requires that sort codes with no weight records in the Vocalink data should be considered valid. These scenarios are reported back by this library in the `ValidationStatus` to highlight when a sort code/account combination is valid but unverified.

## Installation

```bash
npm install uk-account-check
```

```bash
yarn add uk-account-check
```

```bash
pnpm add uk-account-check
```

## Quick Start

```typescript
import { verifyBankAccount, ValidationStatus } from "uk-account-check";

// Method 1: Separate parameters
const { isValid, validationStatus, summary } = verifyBankAccount(
  "089999",
  "66374958"
);

console.log(isValid); // true
console.log(validationStatus); // ValidationStatus.VALIDATED_PASSED
console.log(summary.checksPerformed); // true

// Method 2: Object parameter
const result = verifyBankAccount({
  sortCode: "089999",
  accountNumber: "66374958",
});

// Check for simple validity
if (result.isValid) {
  console.log("Account is valid");
}

// Get just the boolean result
const isValidSimple = verifyBankAccount("089999", "66374958").isValid;
```

## API Reference

The library provides a single function with two different calling patterns:

### `verifyBankAccount(sortCode: string, accountNumber: string): ValidationResult`

### `verifyBankAccount(details: BankDetails): ValidationResult`

Validates UK bank account details and returns comprehensive information about the validation process.

**Parameters (Pattern 1):**

- `sortCode` (string): UK bank sort code (6 digits, may include hyphens or spaces)
- `accountNumber` (string): UK bank account number (6-10 digits, may include hyphens or spaces)

**Parameters (Pattern 2):**

- `details` (BankDetails): Object containing sort code and account number

**Returns:** `ValidationResult` object with validation information

```typescript
interface ValidationResult {
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

enum ValidationStatus {
  VALIDATED_PASSED = "VALIDATED_PASSED",
  ASSUMED_VALID_NO_CHECKS = "ASSUMED_VALID_NO_CHECKS",
  VALIDATED_FAILED = "VALIDATED_FAILED",
  INVALID_INPUT = "INVALID_INPUT",
}
```

## Validation Statuses

- **`ValidationStatus.VALIDATED_PASSED`**: Account details were found in Vocalink data and passed all modulus checks
- **`ValidationStatus.ASSUMED_VALID_NO_CHECKS`**: Sort code not found in Vocalink data, assumed valid per specification
- **`ValidationStatus.VALIDATED_FAILED`**: Account details were found in Vocalink data but failed modulus validation
- **`ValidationStatus.INVALID_INPUT`**: Input format is invalid (non-numeric, wrong length, etc.)

## Response Data Reference

### ValidationResult Object

| Property           | Type                 | Description                                                  |
| ------------------ | -------------------- | ------------------------------------------------------------ |
| `isValid`          | `boolean`            | A boolean representation of whether the check was successful |
| `validationStatus` | `ValidationStatus`   | Detailed status indicating the type of validation result     |
| `input`            | `InputData`          | Information about the original and processed input values    |
| `errors`           | `ValidationError[]?` | Array of validation errors (only present for invalid input)  |
| `checks`           | `CheckResult[]`      | Array of individual modulus check results                    |
| `summary`          | `SummaryData`        | Summary information about the validation process             |

### ValidationStatus Enum

| Value                     | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `VALIDATED_PASSED`        | Account details were found in Vocalink data and passed all modulus checks                 |
| `ASSUMED_VALID_NO_CHECKS` | Sort code not found in Vocalink data, assumed valid per specification (may be fictitious) |
| `VALIDATED_FAILED`        | Account details were found in Vocalink data but failed modulus validation                 |
| `INVALID_INPUT`           | Input format is invalid (non-numeric, wrong length, etc.)                                 |

### InputData Object

| Property                 | Type      | Description                                                     |
| ------------------------ | --------- | --------------------------------------------------------------- |
| `originalSortCode`       | `string`  | The original sort code as provided by the user                  |
| `originalAccountNumber`  | `string`  | The original account number as provided by the user             |
| `sanitizedSortCode`      | `string`  | The sort code after removing hyphens and spaces                 |
| `sanitizedAccountNumber` | `string`  | The account number after transformation and standardization     |
| `transformationApplied`  | `string?` | Description of any transformation applied to the account number |

### ValidationError Object

| Property  | Type                            | Description                                                       |
| --------- | ------------------------------- | ----------------------------------------------------------------- |
| `field`   | `'sortCode' \| 'accountNumber'` | Which field the error relates to                                  |
| `code`    | `string`                        | Error code (e.g., 'INVALID_LENGTH', 'NON_NUMERIC', 'EMPTY_INPUT') |
| `message` | `string`                        | Human-readable error message                                      |

### CheckResult Object

| Property    | Type                            | Description                                |
| ----------- | ------------------------------- | ------------------------------------------ |
| `method`    | `'MOD10' \| 'MOD11' \| 'DBLAL'` | The modulus checking method used           |
| `exception` | `number?`                       | Vocalink exception number applied (if any) |
| `passed`    | `boolean`                       | Whether this individual check passed       |
| `details`   | `CheckDetails?`                 | Detailed calculation information           |

### CheckDetails Object

| Property              | Type                     | Description                                       |
| --------------------- | ------------------------ | ------------------------------------------------- |
| `calculatedRemainder` | `number`                 | The remainder calculated by the modulus operation |
| `expectedRemainder`   | `number`                 | The expected remainder (usually 0)                |
| `weightings`          | `Record<string, number>` | The weightings used in the calculation            |

### SummaryData Object

| Property          | Type      | Description                                             |
| ----------------- | --------- | ------------------------------------------------------- |
| `totalChecks`     | `number`  | Total number of modulus checks performed                |
| `checksPerformed` | `boolean` | Whether any verification checks were actually performed |

### BankDetails Object

| Property        | Type     | Description                                                         |
| --------------- | -------- | ------------------------------------------------------------------- |
| `sortCode`      | `string` | UK bank sort code (6 digits, may include hyphens or spaces)         |
| `accountNumber` | `string` | UK bank account number (6-10 digits, may include hyphens or spaces) |

## Examples

### Basic Validation

```typescript
import { verifyBankAccount, ValidationStatus } from "uk-account-check";

// Method 1: Separate parameters
const result1 = verifyBankAccount("089999", "66374958");
console.log(result1.isValid); // true
console.log(result1.validationStatus); // ValidationStatus.VALIDATED_PASSED

// Method 2: Object parameter
const result2 = verifyBankAccount({
  sortCode: "089999",
  accountNumber: "66374958",
});
console.log(result2.isValid); // true

// Invalid account
const result3 = verifyBankAccount("089999", "66374959");
console.log(result3.isValid); // false
console.log(result3.validationStatus); // ValidationStatus.VALIDATED_FAILED

// Accepts formatted inputs
const result4 = verifyBankAccount("08-99-99", "6637 4958");
console.log(result4.isValid); // true
```

### Comprehensive Validation Handling

```typescript
import { verifyBankAccount, ValidationStatus } from "uk-account-check";

const result = verifyBankAccount("089999", "66374958");

if (result.isValid) {
  console.log("Account is valid");

  if (result.validationStatus === ValidationStatus.ASSUMED_VALID_NO_CHECKS) {
    console.log(
      "Warning: No verification checks were performed - this sort code and account number combination is valid but potentially not in use"
    );
  } else {
    console.log(`Passed ${result.summary.totalChecks} modulus checks`);
  }
} else {
  if (result.errors) {
    // Input validation errors
    result.errors.forEach((error) => {
      console.log(`${error.field}: ${error.message}`);
    });
  } else {
    // Modulus check failures
    console.log("Failed modulus validation");
    result.checks.forEach((check, index) => {
      console.log(
        `Check ${index + 1} (${check.method}): ${
          check.passed ? "PASS" : "FAIL"
        }`
      );
    });
  }
}
```

### Error Handling

```typescript
const result = verifyBankAccount("invalid", "123");

if (result.validationStatus === ValidationStatus.INVALID_INPUT) {
  result.errors?.forEach((error) => {
    switch (error.code) {
      case "INVALID_LENGTH":
        console.log(`${error.field} has incorrect length`);
        break;
      case "NON_NUMERIC":
        console.log(`${error.field} contains non-numeric characters`);
        break;
      case "EMPTY_INPUT":
        console.log(`${error.field} cannot be empty`);
        break;
    }
  });
}
```

### Account Number Transformations

The library automatically handles different UK account number formats:

```typescript
// 10-digit NatWest account (uses last 8 digits)
const natwest = verifyBankAccount("010004", "1234567890");
console.log(natwest.input.transformationApplied); // "10-digit NatWest (last 8 digits used)"

// 9-digit account
// For Santander accounts: (first digit moves to sort code, 8 digits used)
const santanderNineDigit = verifyBankAccount("308000", "123456789");
console.log(santanderNineDigit.input.transformationApplied); // "9-digit account (8 digits used)"

// For other accounts: (drop the first digit)
const nineDigit = verifyBankAccount("308000", "123456789");
console.log(nineDigit.input.transformationApplied); // "9-digit account (8 digits used)"

// 7-digit account (prefixed with 0)
const sevenDigit = verifyBankAccount("089999", "1234567");
console.log(sevenDigit.input.transformationApplied); // "7-digit account (prefixed with 0)"

// 6-digit account (prefixed with 00)
const sixDigit = verifyBankAccount("089999", "123456");
console.log(sixDigit.input.transformationApplied); // "6-digit account (prefixed with 00)"
```

### Checking Detailed Results

```typescript
const result = verifyBankAccount("089999", "66374958");

// See what checks were performed
console.log(`Total checks: ${result.summary.totalChecks}`);
console.log(`Checks performed: ${result.summary.checksPerformed}`);

// Examine individual check results
result.checks.forEach((check, index) => {
  console.log(`Check ${index + 1}:`);
  console.log(`Method: ${check.method}`);
  console.log(`Exception: ${check.exception || "None"}`);
  console.log(`Passed: ${check.passed}`);
  if (check.details) {
    console.log(`Calculated remainder: ${check.details.calculatedRemainder}`);
    console.log(`Expected remainder: ${check.details.expectedRemainder}`);
  }
});
```

## Input Requirements

**Sort Codes:**

- Must be exactly 6 digits
- May include hyphens or spaces (will be stripped)
- Must contain only numeric characters

**Account Numbers:**

- Must be 6-10 digits
- May include hyphens or spaces (will be stripped)
- Must contain only numeric characters
- Automatically handles special formats (NatWest 10-digit, Santander 9-digit, etc.)

## Browser Support

This library works in both Node.js and browser environments. The build provides both CommonJS and ES modules.

## Contributing

Contributions are welcome! Please ensure:

1. All tests pass (`npm run test`)
2. Code follows the existing style (`npm run lint`)
3. New features include appropriate tests
4. Documentation is updated for API changes

## License

MIT License - see LICENSE file for details.

## Changelog

### v1.0.0

- Initial release with comprehensive validation API
- Support for all Vocalink modulus checking methods
- Detailed validation results and error reporting
- Full TypeScript support
