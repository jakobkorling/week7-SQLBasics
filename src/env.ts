import { z } from "zod";

const envSchema = z.object({
  DB_USER: z.string(),
  DB_HOST: z.string(),
  DB_DATABASE: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  PORT: z.coerce.number().default(3000),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(z.treeifyError(result.error));
  process.exit(1);
}

export const env = result.data;

