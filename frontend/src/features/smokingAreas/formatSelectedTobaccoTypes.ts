import type { TobaccoType } from "./types";

export const formatSelectedTobaccoTypes = (tobaccoTypes: TobaccoType[], selectedIds: number[]): string => {
  return tobaccoTypes
    .filter((tobaccoType) => selectedIds.includes(tobaccoType.id))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((tobaccoType) => tobaccoType.name)
    .join(", ");
};
