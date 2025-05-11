import { z } from 'zod'
import path from 'path'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default('0.0.0.0'),
  // Supprimer DATABASE_URL car nous la gérons manuellement
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d')
})

export const env = envSchema.parse(process.env)
