import { z } from 'zod';

const createEnv = () => {
  const envSchema = z.object({
    API_URL: z.string().default('http://localhost:8000/api'),
    SOKETI_HOST: z.string().default('127.0.0.1'),
    SOKETI_PORT: z.string().default('6001'),
    SOKETI_APP_KEY: z.string().default('app-key-phongvan'),
    SOKETI_SCHEME: z.string().default('http'),
    SOKETI_CLUSTER: z.string().default('mt1'),
  });

  const envParsed = envSchema.safeParse({
    API_URL: import.meta.env.VITE_API_BASE_URL,
    SOKETI_HOST: import.meta.env.VITE_SOKETI_HOST,
    SOKETI_PORT: import.meta.env.VITE_SOKETI_PORT,
    SOKETI_APP_KEY: import.meta.env.VITE_SOKETI_APP_KEY,
    SOKETI_SCHEME: import.meta.env.VITE_SOKETI_SCHEME,
    SOKETI_CLUSTER: import.meta.env.VITE_SOKETI_CLUSTER,
  });

  if (!envParsed.success) {
    console.error('Invalid environment variables', envParsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return envParsed.data;
};

export const env = createEnv();
