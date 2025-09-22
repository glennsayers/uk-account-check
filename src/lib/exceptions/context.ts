import { ModulusCheckMethods } from "@/lib/constants/constants";
import type { ModulusCheckContext } from "@/lib/exceptions/exceptions";
import type { Weightings } from "@/lib/modulusChecks/standardCheck";
import type { WeightMap } from "@/lib/sortCode/valacdos";

export function createModulusCheckContext(
  sortCode: string,
  accountNumber: string,
  weightRecord: WeightMap,
  checkNumber: number
): ModulusCheckContext {
  const { modCheck, exception, ...weightings } = weightRecord;

  return {
    sortCode,
    accountNumber,
    weightings,
    modulusValue: modCheck === ModulusCheckMethods.MOD11 ? 11 : 10,
    modulusMethod: modCheck,
    exception,
    checkNumber,
  };
}

export function applyContextToWeightings(
  context: ModulusCheckContext
): Weightings {
  return context.weightings;
}

export function shouldUseModifiedModulusValue(
  context: ModulusCheckContext
): number {
  // Exception 4 uses MOD11 for both checks regardless of original method
  if (context.exception === 4) return 11;
  return context.modulusValue;
}
