import { z } from "zod";

export const webhookValidationSchema = z.object({
  token: z.string(),
  user_identifier: z.string(),
  amount: z.string()
}) 
