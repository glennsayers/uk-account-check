import { describe, expect, test } from "vitest";
import { transformNonStandardAccountNumbers } from "@/lib/accountNumber/account-number";

describe("Account numbers", () => {
  describe("Non Standard", () => {
    describe("10 Digit Account Numbers", () => {
      test("standardises a Natwest account number", () => {
        const accountNumber = "0123456789";
        const natwestSortCode = "010201";
        const {
          accountNumber: standardisedAccountNumber,
          sortCode: standardisedSortCode,
        } = transformNonStandardAccountNumbers(accountNumber, natwestSortCode);

        expect(standardisedAccountNumber.length).toEqual(8);
        expect(standardisedAccountNumber).toEqual("23456789");
        expect(standardisedSortCode).toEqual(natwestSortCode);
      });

      test("standardises a Co-op account number", () => {
        const accountNumber = "1234567890";
        const coopSortCode = "087166";
        const {
          accountNumber: standardisedAccountNumber,
          sortCode: standardisedSortCode,
        } = transformNonStandardAccountNumbers(accountNumber, coopSortCode);
        expect(standardisedAccountNumber.length).toEqual(8);
        expect(standardisedAccountNumber).toEqual("12345678");
        expect(standardisedSortCode).toEqual(coopSortCode);
      });

      test("standardises a Leeds Building Society account number", () => {
        const accountNumber = "1234567890";
        const leedsortCode = "086119";
        const {
          accountNumber: standardisedAccountNumber,
          sortCode: standardisedSortCode,
        } = transformNonStandardAccountNumbers(accountNumber, leedsortCode);
        expect(standardisedAccountNumber.length).toEqual(8);
        expect(standardisedAccountNumber).toEqual("12345678");
        expect(standardisedSortCode).toEqual(leedsortCode);
      });
    });

    describe("9 Digit Account Numbers", () => {
      test("standardises a Santander account number", () => {
        // This test uses an actual Santander sort code as it needs to trigger
        // the Santander specific rules
        const accountNumber = "123456789";
        const testSortCode = "090136";
        const {
          accountNumber: standardisedAccountNumber,
          sortCode: standardisedSortCode,
        } = transformNonStandardAccountNumbers(accountNumber, testSortCode);

        expect(standardisedAccountNumber.length).toEqual(8);
        expect(standardisedAccountNumber).toEqual("23456789");
        expect(standardisedSortCode).toEqual("090131");
      });

      test("standardises a non Santander account number", () => {
        const accountNumber = "123456789";
        const testSortCode = "123456";
        const {
          accountNumber: standardisedAccountNumber,
          sortCode: standardisedSortCode,
        } = transformNonStandardAccountNumbers(accountNumber, testSortCode);

        expect(standardisedAccountNumber.length).toEqual(8);
        expect(standardisedAccountNumber).toEqual("23456789");
        expect(standardisedSortCode).toEqual("123456");
      });
    });

    describe("7 Digit Account Numbers", () => {
      test("standardises a general account number", () => {
        // Use the example details given by vocalink
        const accountNumber = "1234567";
        const testSortCode = "012345";
        const {
          accountNumber: standardisedAccountNumber,
          sortCode: standardisedSortCode,
        } = transformNonStandardAccountNumbers(accountNumber, testSortCode);

        expect(standardisedAccountNumber.length).toEqual(8);
        expect(standardisedAccountNumber).toEqual("01234567");
        expect(standardisedSortCode).toEqual("012345");
      });
    });

    describe("6 Digit Account Numbers", () => {
      test("standardises a general account number", () => {
        // Use the example details given by vocalink
        const accountNumber = "123456";
        const testSortCode = "012345";
        const {
          accountNumber: standardisedAccountNumber,
          sortCode: standardisedSortCode,
        } = transformNonStandardAccountNumbers(accountNumber, testSortCode);

        expect(standardisedAccountNumber.length).toEqual(8);
        expect(standardisedAccountNumber).toEqual("00123456");
        expect(standardisedSortCode).toEqual("012345");
      });
    });
  });
});
