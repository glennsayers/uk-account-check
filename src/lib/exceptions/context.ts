import { ModulusCheckMethods } from "@/lib/constants/constants";
import type { ModulusCheckContext } from "@/lib/exceptions/exceptions";
import type { WeightMap } from "@/lib/sortCode/valacdos";

export function createModulusCheckContext(
  sortCode: string,
  accountNumber: string,
  weightRecord: WeightMap,
  checkNumber: number,
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
