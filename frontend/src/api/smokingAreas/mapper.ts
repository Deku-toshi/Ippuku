import type { ApiSmokingAreaIndexItem } from "./schema";
import type { SmokingAreaDisplay } from "../../features/smokingAreas/types";

export const toSmokingAreaDisplay = (
  api: ApiSmokingAreaIndexItem,
): SmokingAreaDisplay => {
  return {
    id: api.id,
    name: api.name,
    latitude: Number(api.latitude),
    longitude: Number(api.longitude),
    tobaccoTypeIds: api.tobacco_type_ids,
  };
};
