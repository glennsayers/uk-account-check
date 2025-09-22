import { describe, expect, test } from "vitest";
import { verifyBankAccount } from "@/index";
import { ValidationStatus } from "@/lib/types/validation";

describe("Index", () => {
  test("(1) Pass modulus 10 check", () => {
    const { isValid, validationStatus } = verifyBankAccount(
      "089999",
      "66374958"
    );

    expect(isValid).toBeTruthy();
    expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
  });

  test("(2) Pass modulus 11 check", () => {
    const { isValid, validationStatus } = verifyBankAccount(
      "107999",
      "88837491"
    );
    expect(isValid).toBeTruthy();
    expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
  });

  test("(3) Pass modulus 11 and fail double alternate check", () => {
    const { isValid, validationStatus } = verifyBankAccount(
      "203099",
      "66831036"
    );
    expect(isValid).toBeFalsy();
    expect(validationStatus).toEqual(ValidationStatus.VALIDATED_FAILED);
  });

  test("(27) Pass modulus 11 and double alternate checks", () => {
    const { isValid, validationStatus } = verifyBankAccount(
      "202959",
      "63748472"
    );
    expect(isValid).toBeTruthy();
    expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
  });

  test("(28) Fail modulus 11 check and pass double alternate check", () => {
    const { isValid, validationStatus } = verifyBankAccount(
      "203099",
      "58716970"
    );
    expect(isValid).toBeFalsy();
    expect(validationStatus).toEqual(ValidationStatus.VALIDATED_FAILED);
  });

  test("(29) Fail modulus 10 check", () => {
    const { isValid, validationStatus } = verifyBankAccount(
      "089999",
      "66374959"
    );
    expect(isValid).toBeFalsy();
    expect(validationStatus).toEqual(ValidationStatus.VALIDATED_FAILED);
  });

  test("(30) Fail modulus 11 check", () => {
    const { isValid, validationStatus } = verifyBankAccount(
      "107999",
      "88837493"
    );
    expect(isValid).toBeFalsy();
    expect(validationStatus).toEqual(ValidationStatus.VALIDATED_FAILED);
  });

  describe("Exception 1", () => {
    test("(12) Exception 1 – ensures that 27 has been added to the accumulated total and passes double alternate modulus check.", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "118765",
        "64371389"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(26) Exception 1 where it fails double alternate check.", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "118765",
        "64371388"
      );
      expect(isValid).toBeFalsy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_FAILED);
    });
  });

  describe("Exception 2 & 9", () => {
    test("(19) where the first check passes", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "309070",
        "02355688"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(20) where the first check fails and second check passes with substitution", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "309070",
        "12345668"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(21) where a≠0 and g≠9 and passes", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "309070",
        "12345677"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(22) where a≠0 and g=9 and passes", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "309070",
        "99345694"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });
  });

  describe("Exception 3", () => {
    test("(8) the sorting code is the start of a range. As c=6 the second check should be ignored", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "820000",
        "73688637"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(9) the sorting code is the end of a range. As c=9 the second check should be ignored", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "827999",
        "73988638"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(10) as c<>6 or 9 perform both checks pass", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "827101",
        "28748352"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });
  });

  describe("Exception 4", () => {
    test("(11) Exception 4 where the remainder is equal to the checkdigit", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "134020",
        "63849203"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });
  });

  describe("Exception 5", () => {
    test("(14) where the check passes", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "938611",
        "07806039"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(15) where the check passes with substitution", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "938600",
        "42368003"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(16) both checks produce a remainder of 0 and pass", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "938063",
        "55065200"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(23) where the first checkdigit is correct and the second incorrect", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "938063",
        "15764273"
      );
      expect(isValid).toBeFalsy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_FAILED);
    });

    test("(24) where the first checkdigit is incorrect and the second correct", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "938063",
        "15764264"
      );
      expect(isValid).toBeFalsy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_FAILED);
    });

    test("(25) where the first checkdigit is incorrect with a remainder of 1", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "938063",
        "15763217"
      );
      expect(isValid).toBeFalsy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_FAILED);
    });
  });

  describe("Exception 6", () => {
    test("(13) where the account fails standard check but is a foreign currency account", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "200915",
        "41011166"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });
  });

  describe("Exception 7", () => {
    test("(17) passes but would fail the standard check", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "772798",
        "99345694"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });
  });

  describe("Exception 8", () => {
    test("(18) where the check passes", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "086090",
        "06774744"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });
  });

  describe("Exception 10 & 11", () => {
    test("(4) Exception 10 & 11 where first check passes and second check fails", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "871427",
        "46238510"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(5) Exception 10 & 11 where first check fails and second check passes", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "872427",
        "46238510"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(6) Exception 10 where in the account number ab=09 and the g=9. The first check passes and second check fails", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "871427",
        "09123496"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(7) Exception 10 where in the account number ab=99 and the g=9. The first check passes and the second check fails.", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "871427",
        "99123496"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });
  });

  describe("Exception 12/13", () => {
    test("(31) where passes modulus 11 check (in this example, modulus 10 check fails, however, there is no need for it to be performed as the first check passed)", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "074456",
        "12345112"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(32) where passes the modulus 11check (in this example, modulus 10 check passes as well, however,there is no need for it to be performed as the first check passed)", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "070116",
        "34012583"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(33) here fails the modulus 11 check, but passes the modulus 10 check", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "074456",
        "11104102"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });

    test("(34) here fails the modulus 11 check, but passes the modulus 10 check", () => {
      const { isValid, validationStatus } = verifyBankAccount(
        "180002",
        "00000190"
      );
      expect(isValid).toBeTruthy();
      expect(validationStatus).toEqual(ValidationStatus.VALIDATED_PASSED);
    });
  });
});
