const SANTANDER_SORT_CODE_RANGES = [
  {
    start: "090000",
    end: "091900",
  },
  {
    start: "720000",
    end: "729999",
  },
  {
    start: "890000",
    end: "892999",
  },
  {
    start: "165710",
    end: "165710",
  },
];
export const sanitizeAccountNumber = (accountNumber: string): string => {
  return accountNumber.trim().replace(/[-\s]/g, "");
};

export const transformNonStandardAccountNumbers = (
  accountNumber: string,
  sortCode: string
): {
  accountNumber: string;
  sortCode: string;
} => {
  // For 8 digit account numbers we don't need to transform at all
  if (accountNumber.length === 8) {
    return {
      accountNumber,
      sortCode,
    };
  }

  /**
   * 10 digit account numbers need to be handled differently depending on the bank.
   * Co-op and Leeds require the use of the first 8 digits, Natwest requires the use of the last 8.
   * Natwest codes should all start with 01 https://en.wikipedia.org/wiki/Sort_code#England_and_Wales
   */
  if (accountNumber.length === 10) {
    // For Natwest, use the last 8 digits
    if (sortCode.substring(0, 2) === "01") {
      return {
        accountNumber: accountNumber.substring(2, 10),
        sortCode,
      };
    }

    // All other 10 digit banks just use the first 8 digits
    return {
      accountNumber: accountNumber.substring(0, 8),
      sortCode,
    };
  }

  /**
   * Vocalink list Santander as the only bank using 9 digits, however in practice others
   * do too. Here we perform the Vocalink rules for the Santander sortcode ranges,
   * and for others remove the first digit
   * For these we replace the last digit of the sort code
   * with the first digit of the account number, then return the
   * remaining 8 digits
   */
  if (accountNumber.length === 9) {
    const isSantander =
      SANTANDER_SORT_CODE_RANGES.filter((range) => {
        return sortCode >= range.start && sortCode <= range.end;
      }).length > 0;
    const standardisedSortCode = `${sortCode.substring(
      0,
      5
    )}${accountNumber.substring(0, 1)}`;

    return {
      accountNumber: accountNumber.substring(1, 9),
      // For Santander return the modified sort code, for other banks return as is
      sortCode: isSantander ? standardisedSortCode : sortCode,
    };
  }

  /**
   * 7 digit accounts are prefixed with a 0
   */
  if (accountNumber.length === 7) {
    return {
      accountNumber: `0${accountNumber}`,
      sortCode,
    };
  }

  /**
   * 6 digit accounts are prefixed with a 0
   */
  if (accountNumber.length === 6) {
    return {
      accountNumber: `00${accountNumber}`,
      sortCode,
    };
  }

  return {
    accountNumber,
    sortCode,
  };
};
