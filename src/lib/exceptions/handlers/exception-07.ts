import type {
  ExceptionHandler,
  ModulusCheckContext,
} from "@/lib/exceptions/exceptions";

export class Exception07Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 7;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    if (parseInt(context.accountNumber[6], 10) === 9) {
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
}
