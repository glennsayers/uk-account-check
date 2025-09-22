import type {
  ExceptionHandler,
  ModulusCheckContext,
  ResultsPredicate,
} from "@/lib/exceptions/exceptions";
import { performStandardCheck } from "@/lib/modulusChecks/standardCheck";

export class Exception14Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 14;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    return context;
  }

  static getResultPredicate(): ResultsPredicate {
    return (results, contexts) => {
      // If first check passes, account is valid (skip second check)
      if (results[0] === true) {
        return true;
      }

      const accountNumber = contexts[0].accountNumber;
      const eighthDigit = parseInt(accountNumber[7], 10); // position 'h'

      // If 8th digit is NOT 0, 1, or 9, then invalid
      if (eighthDigit !== 0 && eighthDigit !== 1 && eighthDigit !== 9) {
        return false;
      }

      /**
       * Exception 14 requires us to rerun the check with a modified
       * account number. We need to remove the 8th digit, insert 0 at the start,
       * and rerun.
       **/

      const modifiedAccountNumber = `0${accountNumber.slice(0, 7)}`;
      const modifiedContext = {
        ...contexts[0],
        accountNumber: modifiedAccountNumber,
      };

      const rerunResult = performStandardCheck(modifiedContext);

      return rerunResult.passed === true;
    };
  }
}
