import { z } from "zod";

export const userAuthValidationSchema = z.object({
  phone: z.string(),
  password: z.string()
});
