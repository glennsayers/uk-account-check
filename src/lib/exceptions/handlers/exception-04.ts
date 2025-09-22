import type {
  ExceptionHandler,
  ModulusCheckContext,
} from "@/lib/exceptions/exceptions";

export class Exception04Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 4;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    // Exception 4 doesn't modify the context during calculation
    // The special logic happens in the final modulus check
    return context;
  }

  validateResult(
    modulusResult: number,
    finalModulusValue: number,
    context: ModulusCheckContext
  ): boolean {
    const checkdigit = parseInt(context.accountNumber.substring(6, 8), 10);
    return modulusResult % finalModulusValue === checkdigit;
  }
}
