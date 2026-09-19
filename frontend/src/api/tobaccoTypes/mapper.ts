import type { ApiTobaccoType } from "./schema";
import type { TobaccoType } from "../../features/smokingAreas/types";

export const toTobaccoType = (api: ApiTobaccoType): TobaccoType => {
  return {
    id: api.id,
    name: api.name,
    icon: api.icon,
    displayOrder: api.display_order,
  };
};
