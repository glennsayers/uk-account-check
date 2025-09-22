import type {
  ExceptionHandler,
  ModulusCheckContext,
  ResultsPredicate,
} from "@/lib/exceptions/exceptions";

export class Exception10Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 10;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    const accountDigitAB = context.accountNumber.substring(0, 2);

    if (["09", "99"].includes(accountDigitAB)) {
      return {
        ...context,
        weightings: {
          ...context.weightings,
          u: 0,
          v: 0,
          w: 0,
          x: 0,
          y: 0,
          z: 0,
          a: 0,
          b: 0,
        },
      };
    }

    return context;
  }

  static getResultPredicate(): ResultsPredicate {
    return (results) => results.some(Boolean);
  }
}
