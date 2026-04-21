import { describe, expect, test } from "vitest";
import { valacdosData } from "@/data/valacdos";
import { ModulusCheckMethods } from "@/lib/constants/constants";
import {
  getModulusWeights,
  type SortcodeValacdos,
} from "@/lib/sortCode/valacdos";

const toSortCode = (value: number) => value.toString().padStart(6, "0");

const midpointSortCode = (record: SortcodeValacdos) => {
  const start = Number(record.start);
  const end = Number(record.end);

  return toSortCode(Math.floor((start + end) / 2));
};

const linearLookup = (sortCode: string) =>
  valacdosData
    .filter((weight) => sortCode >= weight.start && sortCode <= weight.end)
    .map((record) => {
      const { start: _start, end: _end, ...rest } = record;

      return rest;
    });

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

  test("indexed lookup matches linear lookup for all range boundaries and midpoints", () => {
    const sortCodes = new Set<string>();

    for (const record of valacdosData) {
      sortCodes.add(record.start);
      sortCodes.add(midpointSortCode(record));
      sortCodes.add(record.end);
    }

    for (const sortCode of sortCodes) {
      expect(getModulusWeights(sortCode)).toEqual(linearLookup(sortCode));
    }
  });
});
