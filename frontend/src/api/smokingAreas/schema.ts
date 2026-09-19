import { z } from "zod";

export const ApiSmokingAreaSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  tobacco_type_ids: z.array(z.number()),
});

export type ApiSmokingAreaIndexItem = z.infer<typeof ApiSmokingAreaSchema>;
