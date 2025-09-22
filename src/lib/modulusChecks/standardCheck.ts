import { ModulusCheckMethods } from "@/lib/constants/constants";
import type { ModulusCheckContext } from "@/lib/exceptions/exceptions";
import { exceptionRegistry } from "@/lib/exceptions/registry";
import type { WeightMap } from "@/lib/sortCode/valacdos";
import type { CheckResult } from "@/lib/types/validation";

export type Weightings = Omit<WeightMap, "modCheck" | "exception"> & {
  [key: string]: number;
};

export const performStandardCheck = (
  context: ModulusCheckContext
): CheckResult => {
  // Extract needed values from context
  const {
    accountNumber,
    sortCode,
    modulusMethod,
    weightings,
    exception,
    modulusValue,
  } = context;

  const accountAndSortMap: Weightings = {
    u: parseInt(sortCode[0], 10),
    v: parseInt(sortCode[1], 10),
    w: parseInt(sortCode[2], 10),
    x: parseInt(sortCode[3], 10),
    y: parseInt(sortCode[4], 10),
    z: parseInt(sortCode[5], 10),
    a: parseInt(accountNumber[0], 10),
    b: parseInt(accountNumber[1], 10),
    c: parseInt(accountNumber[2], 10),
    d: parseInt(accountNumber[3], 10),
    e: parseInt(accountNumber[4], 10),
    f: parseInt(accountNumber[5], 10),
    g: parseInt(accountNumber[6], 10),
    h: parseInt(accountNumber[7], 10),
  };

  if (exception && canSkipCheck(exception, accountAndSortMap)) {
    return {
      method: modulusMethod,
      exception,
      passed: true,
      details: {
        calculatedRemainder: 0,
        expectedRemainder: 0,
        weightings: weightings as Record<string, number>,
      },
    };
  }

  const modulusResult =
    modulusMethod === ModulusCheckMethods.DBLAL
      ? dblAltResult(accountAndSortMap, weightings, exception)
      : standardCheckResult(accountAndSortMap, weightings);

  // Use provided modulus value from any exception, or fallback to the default modulus logic
  const finalModulusValue =
    modulusValue ?? (modulusMethod === ModulusCheckMethods.MOD11 ? 11 : 10);

  const handler = exceptionRegistry.getHandler(exception);
  let passed: boolean;

  if (handler?.validateResult) {
    passed = handler.validateResult(modulusResult, finalModulusValue, context);
  } else {
    passed = modulusResult % finalModulusValue === 0;
  }

  return {
    method: modulusMethod,
    exception,
    passed,
    details: {
      calculatedRemainder: modulusResult % finalModulusValue,
      expectedRemainder: 0,
      weightings: weightings as Record<string, number>,
    },
  };
};

const standardCheckResult = (
  accountAndSortMap: Weightings,
  weightingRecord: Weightings
): number => {
  return Object.keys(accountAndSortMap).reduce((prev, current) => {
    return prev + accountAndSortMap[current] * weightingRecord[current];
  }, 0);
};

const dblAltResult = (
  accountAndSortMap: Weightings,
  weightingRecord: Weightings,
  exception: number | undefined
): number => {
  let modulusResult = Object.keys(accountAndSortMap).reduce(
    (total, current) => {
      const weightingCalc =
        accountAndSortMap[current] * weightingRecord[current];

      /**
       * Break the number into numbers and add them.
       * e.g 14 becomes 1 + 4
       **/
      const individualSummation = weightingCalc
        .toString()
        .split("")
        .reduce((prev, curr) => prev + +curr, 0);
      return total + individualSummation;
    },
    0
  );

  /**
   * Exception 1 requires the addition of 27 to the total before dividing
   */
  if (exception === 1) {
    modulusResult += 27;
  }

  return modulusResult;
};

const canSkipCheck = (
  exception: number,
  accountAndSortMap: Weightings
): boolean => {
  /**
   * Exception 3 allows us to skip this check in certain scenarioes
   */
  if (exception === 3) {
    const accountDigitC = accountAndSortMap.c;
    if (accountDigitC === 6 || accountDigitC === 9) {
      return true;
    }
  }

  if (exception === 6) {
    // If value a is equal to one of the below we can skip the check
    const { a, g, h } = accountAndSortMap;
    const doesAccountNumberMeetRequirment =
      a === 4 || a === 5 || a === 6 || a === 7 || a === 8;

    // If g and h are equal we can skip the check
    return doesAccountNumberMeetRequirment && g === h;
  }

  return false;
};
