import type {
  ExceptionHandler,
  ModulusCheckContext,
  ResultsPredicate,
} from "@/lib/exceptions/exceptions";

export class Exception12Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 12;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    return context;
  }

  static getResultPredicate(): ResultsPredicate {
    return (results) => results.some(Boolean);
  }
}
