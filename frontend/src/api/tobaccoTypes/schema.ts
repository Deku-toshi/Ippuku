import { z } from "zod";

export const ApiTobaccoTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  display_order: z.number(),
});

export type ApiTobaccoType = z.infer<typeof ApiTobaccoTypeSchema>;
