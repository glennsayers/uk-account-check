import type {
  ExceptionHandler,
  ModulusCheckContext,
  ResultsPredicate,
} from "@/lib/exceptions/exceptions";

export class Exception02Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 2;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    const accountDigitA = parseInt(context.accountNumber[0], 10); // position 'a'
    const accountDigitG = parseInt(context.accountNumber[6], 10); // position 'g'

    let newWeightings = { ...context.weightings };

    if (accountDigitA !== 0 && accountDigitG !== 9) {
      // Use first weighting table
      newWeightings = {
        u: 0,
        v: 0,
        w: 1,
        x: 2,
        y: 5,
        z: 3,
        a: 6,
        b: 4,
        c: 8,
        d: 7,
        e: 10,
        f: 9,
        g: 3,
        h: 1,
      };
    } else if (accountDigitA !== 0 && accountDigitG === 9) {
      // Use second weighting table
      newWeightings = {
        u: 0,
        v: 0,
        w: 0,
        x: 0,
        y: 0,
        z: 0,
        a: 0,
        b: 0,
        c: 8,
        d: 7,
        e: 10,
        f: 9,
        g: 3,
        h: 1,
      };
    }

    return {
      ...context,
      weightings: newWeightings,
    };
  }

  static getResultPredicate(): ResultsPredicate {
    return (results) => {
      if (results[0] === true) {
        return true;
      }
      return results[1] === true;
    };
  }
}
