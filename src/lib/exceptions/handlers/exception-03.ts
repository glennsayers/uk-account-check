import type {
  ExceptionHandler,
  ModulusCheckContext,
} from "@/lib/exceptions/exceptions";

export class Exception03Handler implements ExceptionHandler {
  shouldApply(exception: number): boolean {
    return exception === 3;
  }

  apply(context: ModulusCheckContext): ModulusCheckContext {
    return context;
  }
}
