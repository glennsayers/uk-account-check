import type {
  ModulusCheckContext,
  ResultsPredicate,
} from "@/lib/exceptions/exceptions";
import { Exception01Handler } from "@/lib/exceptions/handlers/exception-01";
import { Exception02Handler } from "@/lib/exceptions/handlers/exception-02";
import { Exception04Handler } from "@/lib/exceptions/handlers/exception-04";
import { Exception05Handler } from "@/lib/exceptions/handlers/exception-05";
import { Exception07Handler } from "@/lib/exceptions/handlers/exception-07";
import { Exception08Handler } from "@/lib/exceptions/handlers/exception-08";
import { Exception09Handler } from "@/lib/exceptions/handlers/exception-09";
import { Exception10Handler } from "@/lib/exceptions/handlers/exception-10";
import { Exception12Handler } from "@/lib/exceptions/handlers/exception-12";
import { Exception14Handler } from "@/lib/exceptions/handlers/exception-14";
import type { WeightMap } from "@/lib/sortCode/valacdos";

interface ExceptionHandler {
  apply(
    context: ModulusCheckContext,
    weightRecords: WeightMap[],
  ): ModulusCheckContext;
  shouldApply(exception: number): boolean;
  validateResult?(
    modulusResult: number,
    finalModulusValue: number,
    context: ModulusCheckContext,
  ): boolean;
}

export class ExceptionRegistry {
  private handlers: Map<number, ExceptionHandler[]> = new Map();

  register(exceptionNumber: number, handler: ExceptionHandler): void {
    if (!this.handlers.has(exceptionNumber)) {
      this.handlers.set(exceptionNumber, []);
    }
    const handlers = this.handlers.get(exceptionNumber);
    if (handlers) {
      handlers.push(handler);
    }
  }

  applyExceptions(
    context: ModulusCheckContext,
    weightRecords: WeightMap[],
  ): ModulusCheckContext {
    if (!context.exception) return context;

    //Exception 2 and 9 should only run if they are paired
    if (context.exception === 2) {
      const hasException9Next = weightRecords[1]?.exception === 9;
      if (!hasException9Next) {
        // Since this isn't paired with exception 9, don't run any additional handlers
        return context;
      }
    }

    if (context.exception === 9) {
      const hasException2Next = weightRecords[0]?.exception === 2;
      if (!hasException2Next) {
        // Since this isn't paired with exception 2, don't run any additional handlers
        return context;
      }
    }

    const handlers = this.handlers.get(context.exception) || [];
    return handlers.reduce(
      (ctx, handler) => handler.apply(ctx, weightRecords),
      context,
    );
  }
  getResultPredicate(weightRecords: WeightMap[]): ResultsPredicate {
    // Exception 2+9: Special Lloyds sterling/euro account logic
    if (
      weightRecords[0]?.exception === 2 &&
      weightRecords[1]?.exception === 9
    ) {
      return Exception02Handler.getResultPredicate();
    }

    // Exception 10+11 combination requires "some" checks to pass
    if (
      weightRecords[0]?.exception === 10 &&
      weightRecords[1]?.exception === 11
    ) {
      return Exception10Handler.getResultPredicate();
    }

    // Exception 12 & 13 combination requires "some" checks to pass
    if (
      weightRecords[0]?.exception === 12 &&
      weightRecords[1]?.exception === 13
    ) {
      return Exception12Handler.getResultPredicate();
    }

    // Exception 14: Special conditional logic
    if (weightRecords[0]?.exception === 14) {
      return Exception14Handler.getResultPredicate();
    }

    // Default: all checks must pass
    return (results) => results.every(Boolean);
  }

  getHandler(
    exceptionNumber: number | undefined,
  ): ExceptionHandler | undefined {
    if (!exceptionNumber) return undefined;

    const handlers = this.handlers.get(exceptionNumber);
    return handlers?.[0]; // Return first handler for this exception
  }
}

export const exceptionRegistry = new ExceptionRegistry();

// Handlers only need registered if they modify the modulus check context
exceptionRegistry.register(1, new Exception01Handler());
exceptionRegistry.register(2, new Exception02Handler());
exceptionRegistry.register(4, new Exception04Handler());
exceptionRegistry.register(5, new Exception05Handler());
exceptionRegistry.register(7, new Exception07Handler());
exceptionRegistry.register(8, new Exception08Handler());
exceptionRegistry.register(9, new Exception09Handler());
exceptionRegistry.register(10, new Exception10Handler());
exceptionRegistry.register(14, new Exception14Handler());
