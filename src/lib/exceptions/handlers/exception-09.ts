import type {
  ExceptionHandler,
  ModulusCheckContext,
} from "@/lib/exceptions/exceptions";

export class Exception09Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 9;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    const modifiedContext = {
      ...context,
      sortCode: "309634",
    };

    return {
      ...modifiedContext,
    };
  }
}
