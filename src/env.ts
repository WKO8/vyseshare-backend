import { z } from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(8888),
    POSTGRES_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SECRET_KEY: z.string(),
    MAIL_USERNAME: z.string().email(),
    MAIL_USERNAME_FROM: z.string().email(),
    OAUTH_CLIENT_ID: z.string(),
    OAUTH_CLIENT_SECRET: z.string(),
    OAUTH_REFRESH_TOKEN: z.string(),
})

export const env = envSchema.parse(process.env)
