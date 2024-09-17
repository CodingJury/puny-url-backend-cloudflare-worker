import z from "zod"

export const urlSchemaValidator = z.object({
  originalUrl: z.string().min(1).url(),
  expire: z.enum(["1-month","1-day","6-hours", "1-hour", "1-minute"])
});

export type urlSchemaValidator = z.infer<typeof urlSchemaValidator>;