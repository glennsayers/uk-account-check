import { sortCodeSubstitutions } from "@/data/scsub";
import { ModulusCheckMethods } from "@/lib/constants/constants";
import type {
  ExceptionHandler,
  ModulusCheckContext,
} from "@/lib/exceptions/exceptions";

export class Exception05Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 5;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    const substitution = sortCodeSubstitutions[context.sortCode];
    if (!substitution) return context;

    return {
      ...context,
      sortCode: substitution,
    };
  }

  validateResult(
    modulusResult: number,
    finalModulusValue: number,
    context: ModulusCheckContext
  ): boolean {
    if (context.checkNumber === 1) {
      const remainder = modulusResult % 11;
      const accountDigitG = parseInt(context.accountNumber[6], 10);

      if (remainder === 0 && accountDigitG === 0) {
        return true;
      }

      if (remainder === 1) {
        return false;
      }

      const calculatedCheckdigit = 11 - remainder;
      return calculatedCheckdigit === accountDigitG;
    }

    // Second check: DBLAL with digit 'h' validation
    if (
      context.checkNumber === 2 &&
      context.modulusMethod === ModulusCheckMethods.DBLAL
    ) {
      const remainder = modulusResult % 10; // Always use MOD10 for DBLAL
      const accountDigitH = parseInt(context.accountNumber[7], 10); // position 'h'

      // If remainder = 0 and h = 0, valid
      if (remainder === 0 && accountDigitH === 0) {
        return true;
      }

      // For all other remainders: (10 - remainder) should equal h
      const calculatedCheckdigit = 10 - remainder;
      return calculatedCheckdigit === accountDigitH;
    }

    // For non-DBLAL second checks or other scenarios, use standard validation
    return modulusResult % finalModulusValue === 0;
  }
}
