import { z } from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(8888),
    POSTGRES_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SECRET_KEY: z.string(),
    // WEB_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
