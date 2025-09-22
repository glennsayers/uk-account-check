import type {
  ExceptionHandler,
  ModulusCheckContext,
} from "@/lib/exceptions/exceptions";

export class Exception01Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 1;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    // Exception 1: Add 27 to DBLAL calculation result
    // This is handled in the calculation phase, not context modification
    return context;
  }

  getDescription(): string {
    return "Add 27 to the calculation if using the double alternate method";
  }
}
