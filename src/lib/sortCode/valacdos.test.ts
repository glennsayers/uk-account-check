import { describe, expect, test } from "vitest";
import { ModulusCheckMethods } from "@/lib/constants/constants";
import { getModulusWeights } from "@/lib/sortCode/valacdos";

describe("Valacdos Lookup", () => {
  test("correctly returns a weighting with 1 matching record", async () => {
    const matchingRecords = await getModulusWeights("010005");
    expect(matchingRecords.length).toEqual(1);
    expect(matchingRecords[0].modCheck).toEqual(ModulusCheckMethods.MOD11);
  });

  test("correctly returns a weighting with 2 matching records", async () => {
    const matchingRecords = await getModulusWeights("040335");
    expect(matchingRecords.length).toEqual(2);
    expect(matchingRecords[0].modCheck).toEqual(ModulusCheckMethods.MOD11);
    expect(matchingRecords[1].modCheck).toEqual(ModulusCheckMethods.DBLAL);
  });
});
