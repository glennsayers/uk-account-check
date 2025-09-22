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

export const getModulusWeights = (sortCode: string): WeightMap[] => {
  const weightings = valacdosData.filter((weight) => {
    return sortCode >= weight.start && sortCode <= weight.end;
  });

  return weightings.map((record): WeightMap => {
    const { start: _start, end: _end, ...rest } = record;

    return rest;
  });
};
