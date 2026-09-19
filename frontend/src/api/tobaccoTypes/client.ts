import { fetchJson } from "../httpClient";
import { toTobaccoType } from "./mapper";
import { ApiTobaccoTypeSchema } from "./schema";
import type { TobaccoType } from "../../features/smokingAreas/types";

export const fetchTobaccoTypes = async (): Promise<TobaccoType[]> => {
  const apiTobaccoTypes = await fetchJson("/v1/tobacco_types");
  const validatedTobaccoTypes = ApiTobaccoTypeSchema.array().parse(apiTobaccoTypes);
  return validatedTobaccoTypes.map(toTobaccoType);
};
