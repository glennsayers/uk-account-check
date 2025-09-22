export const sanitizeSortCode = (sortCode: string): string => {
  return sortCode.trim().replace(/[-\s]/g, "");
};
