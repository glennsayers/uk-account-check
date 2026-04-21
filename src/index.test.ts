import { describe, expect, test } from "vitest";
import { verifyBankAccount } from "@/index";
import { ValidationStatus } from "@/lib/types/validation";

const vocalinkVectors = [
  {
    caseNumber: 1,
    description: "Pass modulus 10 check",
    sortCode: "089999",
    accountNumber: "66374958",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 2,
    description: "Pass modulus 11 check",
    sortCode: "107999",
    accountNumber: "88837491",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 3,
    description: "Pass modulus 11 and fail double alternate check",
    sortCode: "203099",
    accountNumber: "66831036",
    expectedIsValid: false,
    expectedValidationStatus: ValidationStatus.VALIDATED_FAILED,
  },
  {
    caseNumber: 4,
    description:
      "Exception 10 & 11 where first check passes and second check fails",
    sortCode: "871427",
    accountNumber: "46238510",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 5,
    description:
      "Exception 10 & 11 where first check fails and second check passes",
    sortCode: "872427",
    accountNumber: "46238510",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 6,
    description:
      "Exception 10 where ab=09 and g=9; first check passes and second check fails",
    sortCode: "871427",
    accountNumber: "09123496",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 7,
    description:
      "Exception 10 where ab=99 and g=9; first check passes and second check fails",
    sortCode: "871427",
    accountNumber: "99123496",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 8,
    description:
      "Sorting code is the start of a range; as c=6 the second check is ignored",
    sortCode: "820000",
    accountNumber: "73688637",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 9,
    description:
      "Sorting code is the end of a range; as c=9 the second check is ignored",
    sortCode: "827999",
    accountNumber: "73988638",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 10,
    description: "As c<>6 or 9 perform both checks and pass",
    sortCode: "827101",
    accountNumber: "28748352",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 11,
    description: "Exception 4 where the remainder is equal to the check digit",
    sortCode: "134020",
    accountNumber: "63849203",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 12,
    description:
      "Exception 1 adds 27 to the accumulated total and passes double alternate modulus check",
    sortCode: "118765",
    accountNumber: "64371389",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 13,
    description:
      "Account fails standard check but is a foreign currency account",
    sortCode: "200915",
    accountNumber: "41011166",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 14,
    description: "Exception 5 where the check passes",
    sortCode: "938611",
    accountNumber: "07806039",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 15,
    description: "Exception 5 where the check passes with substitution",
    sortCode: "938600",
    accountNumber: "42368003",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 16,
    description: "Both checks produce a remainder of 0 and pass",
    sortCode: "938063",
    accountNumber: "55065200",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 17,
    description: "Exception 7 passes but would fail the standard check",
    sortCode: "772798",
    accountNumber: "99345694",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 18,
    description: "Exception 8 where the check passes",
    sortCode: "086090",
    accountNumber: "06774744",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 19,
    description: "Exception 2 & 9 where the first check passes",
    sortCode: "309070",
    accountNumber: "02355688",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 20,
    description:
      "Exception 2 & 9 where the first check fails and second check passes with substitution",
    sortCode: "309070",
    accountNumber: "12345668",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 21,
    description: "Exception 2 & 9 where a<>0 and g<>9 and passes",
    sortCode: "309070",
    accountNumber: "12345677",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 22,
    description: "Exception 2 & 9 where a<>0 and g=9 and passes",
    sortCode: "309070",
    accountNumber: "99345694",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 23,
    description:
      "Exception 5 where the first check digit is correct and the second incorrect",
    sortCode: "938063",
    accountNumber: "15764273",
    expectedIsValid: false,
    expectedValidationStatus: ValidationStatus.VALIDATED_FAILED,
  },
  {
    caseNumber: 24,
    description:
      "Exception 5 where the first check digit is incorrect and the second correct",
    sortCode: "938063",
    accountNumber: "15764264",
    expectedIsValid: false,
    expectedValidationStatus: ValidationStatus.VALIDATED_FAILED,
  },
  {
    caseNumber: 25,
    description:
      "Exception 5 where the first check digit is incorrect with a remainder of 1",
    sortCode: "938063",
    accountNumber: "15763217",
    expectedIsValid: false,
    expectedValidationStatus: ValidationStatus.VALIDATED_FAILED,
  },
  {
    caseNumber: 26,
    description: "Exception 1 where it fails double alternate check",
    sortCode: "118765",
    accountNumber: "64371388",
    expectedIsValid: false,
    expectedValidationStatus: ValidationStatus.VALIDATED_FAILED,
  },
  {
    caseNumber: 27,
    description: "Pass modulus 11 and double alternate checks",
    sortCode: "202959",
    accountNumber: "63748472",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 28,
    description: "Fail modulus 11 check and pass double alternate check",
    sortCode: "203099",
    accountNumber: "58716970",
    expectedIsValid: false,
    expectedValidationStatus: ValidationStatus.VALIDATED_FAILED,
  },
  {
    caseNumber: 29,
    description: "Fail modulus 10 check",
    sortCode: "089999",
    accountNumber: "66374959",
    expectedIsValid: false,
    expectedValidationStatus: ValidationStatus.VALIDATED_FAILED,
  },
  {
    caseNumber: 30,
    description: "Fail modulus 11 check",
    sortCode: "107999",
    accountNumber: "88837493",
    expectedIsValid: false,
    expectedValidationStatus: ValidationStatus.VALIDATED_FAILED,
  },
  {
    caseNumber: 31,
    description:
      "Exception 12/13 passes modulus 11 check; no need to perform modulus 10 check",
    sortCode: "074456",
    accountNumber: "12345112",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 32,
    description:
      "Exception 12/13 passes modulus 11 check; modulus 10 also passes but is not needed",
    sortCode: "070116",
    accountNumber: "34012583",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 33,
    description:
      "Exception 12/13 fails modulus 11 check but passes modulus 10 check",
    sortCode: "074456",
    accountNumber: "11104102",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
  {
    caseNumber: 34,
    description: "Exception 14 where the first check fails and second passes",
    sortCode: "180002",
    accountNumber: "00000190",
    expectedIsValid: true,
    expectedValidationStatus: ValidationStatus.VALIDATED_PASSED,
  },
] as const;

describe("Index", () => {
  describe("Vocalink appendix vectors", () => {
    test.each(vocalinkVectors)("($caseNumber) $description", ({
      sortCode,
      accountNumber,
      expectedIsValid,
      expectedValidationStatus,
    }) => {
      const { isValid, validationStatus } = verifyBankAccount(
        sortCode,
        accountNumber,
      );

      expect(isValid).toBe(expectedIsValid);
      expect(validationStatus).toEqual(expectedValidationStatus);
    });
  });

  describe("Public API", () => {
    test("object-form overload returns the same result as tuple form", () => {
      const tupleResult = verifyBankAccount("089999", "66374958");
      const objectResult = verifyBankAccount({
        sortCode: "089999",
        accountNumber: "66374958",
      });

      expect(objectResult).toEqual(tupleResult);
    });
  });

  describe("Invalid input", () => {
    test.each([
      {
        description: "empty sort code",
        sortCode: "",
        accountNumber: "66374958",
        expectedError: { field: "sortCode", code: "EMPTY_INPUT" },
      },
      {
        description: "non-numeric sort code",
        sortCode: "abc",
        accountNumber: "66374958",
        expectedError: { field: "sortCode", code: "NON_NUMERIC" },
      },
      {
        description: "too-short sort code",
        sortCode: "12345",
        accountNumber: "66374958",
        expectedError: { field: "sortCode", code: "INVALID_LENGTH" },
      },
      {
        description: "whitespace-only account number",
        sortCode: "089999",
        accountNumber: "   ",
        expectedError: { field: "accountNumber", code: "EMPTY_INPUT" },
      },
    ])("returns INVALID_INPUT shape for $description", ({
      sortCode,
      accountNumber,
      expectedError,
    }) => {
      const result = verifyBankAccount(sortCode, accountNumber);

      expect(result.isValid).toBe(false);
      expect(result.validationStatus).toEqual(ValidationStatus.INVALID_INPUT);
      expect(result.errors?.length).toBeGreaterThan(0);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.objectContaining(expectedError)]),
      );
      expect(result.input).toEqual({
        originalSortCode: sortCode,
        originalAccountNumber: accountNumber,
        sanitizedSortCode: "",
        sanitizedAccountNumber: "",
      });
      expect(result.checks).toEqual([]);
      expect(result.summary).toEqual({
        totalChecks: 0,
        checksPerformed: false,
      });
    });
  });

  describe("Assumed valid without checks", () => {
    test("assumes valid when the sort code has no Vocalink weight records", () => {
      const result = verifyBankAccount("999999", "12345678");

      expect(result.isValid).toBe(true);
      expect(result.validationStatus).toEqual(
        ValidationStatus.ASSUMED_VALID_NO_CHECKS,
      );
      expect(result.errors).toBeUndefined();
      expect(result.checks).toEqual([]);
      expect(result.summary).toEqual({
        totalChecks: 0,
        checksPerformed: false,
      });
    });
  });

  describe("Account number transformation reporting", () => {
    test.each([
      ["010004", "1234567890", "10-digit NatWest (last 8 digits used)"],
      ["308000", "123456789", "9-digit account (8 digits used)"],
      ["089999", "1234567", "7-digit account (prefixed with 0)"],
      ["089999", "123456", "6-digit account (prefixed with 00)"],
    ])("reports transformation applied for %s / %s", (sortCode, accountNumber, transformationApplied) => {
      const result = verifyBankAccount(sortCode, accountNumber);

      expect(result.input.transformationApplied).toEqual(transformationApplied);
    });
  });
});
