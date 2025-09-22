import type {
  ExceptionHandler,
  ModulusCheckContext,
} from "@/lib/exceptions/exceptions";

export class Exception08Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 8;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    return {
      ...context,
      sortCode: "090126",
    };
  }
}
