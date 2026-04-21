import { valacdosData } from "@/data/valacdos";
import type { ModulusCheckMethods } from "@/lib/constants/constants";
export type SortcodeValacdos = {
  start: string;
  end: string;
  modCheck: ModulusCheckMethods;
  u: number;
  v: number;
  w: number;
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
  exception: number | undefined;
};

export type WeightMap = Omit<SortcodeValacdos, "start" | "end">;

const SORT_CODE_BUCKET_DIGITS = 4;

const buildValacdosIndex = () => {
  const index: (SortcodeValacdos[] | undefined)[] = [];

  // Index by the first four sort-code digits so each lookup only scans a
  // small candidate bucket instead of every valacdos record.
  for (const record of valacdosData) {
    const startBucket = Number(record.start.slice(0, SORT_CODE_BUCKET_DIGITS));
    const endBucket = Number(record.end.slice(0, SORT_CODE_BUCKET_DIGITS));

    // Push records in source order to preserve two-record exception handling.
    for (let bucket = startBucket; bucket <= endBucket; bucket += 1) {
      let records = index[bucket];

      if (!records) {
        records = [];
        index[bucket] = records;
      }

      records.push(record);
    }
  }

  return index;
};

const valacdosIndex = buildValacdosIndex();

export const getModulusWeights = (sortCode: string): WeightMap[] => {
  const bucket = Number(sortCode.slice(0, SORT_CODE_BUCKET_DIGITS));
  const candidates = valacdosIndex[bucket] ?? [];
  const weightings = candidates.filter((weight) => {
    return sortCode >= weight.start && sortCode <= weight.end;
  });

  return weightings.map((record): WeightMap => {
    const { start: _start, end: _end, ...rest } = record;

    return rest;
  });
};
