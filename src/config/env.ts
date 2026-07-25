import { z } from 'zod';

const getInitialApiUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // If running on production domain (not local dev)
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.endsWith('.test')) {
      return 'https://phongvan-be.vitrasau.info.vn/v1';
    }
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://api.phongvan_be.test/v1';
};

const createEnv = () => {
  const envSchema = z.object({
    API_URL: z.string().default('http://api.phongvan_be.test/v1'),
    SOKETI_HOST: z.string().default('103.82.193.110'),
    SOKETI_PORT: z.string().default('6001'),
    SOKETI_APP_KEY: z.string().default('app-key-100'),
    SOKETI_SCHEME: z.string().default('http'),
    SOKETI_CLUSTER: z.string().default('mt1'),
  });

  const envParsed = envSchema.safeParse({
    API_URL: getInitialApiUrl(),
    SOKETI_HOST: import.meta.env.VITE_SOKETI_HOST || '103.82.193.110',
    SOKETI_PORT: import.meta.env.VITE_SOKETI_PORT || '6001',
    SOKETI_APP_KEY: import.meta.env.VITE_SOKETI_APP_KEY || 'app-key-100',
    SOKETI_SCHEME: import.meta.env.VITE_SOKETI_SCHEME || 'http',
    SOKETI_CLUSTER: import.meta.env.VITE_SOKETI_CLUSTER || 'mt1',
  });

  if (!envParsed.success) {
    console.error('Invalid environment variables', envParsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return envParsed.data;
};

export const env = createEnv();
