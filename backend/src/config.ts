export interface RuntimeConfig {
  port: number;
  clientOrigin: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export function resolveApiBaseUrl(value?: string): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return 'http://localhost:4000';
  return trimmed.replace(/\/+$/, '');
}

export function getRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const port = Number(env.PORT ?? 4000);
  const clientOrigin = env.CLIENT_ORIGIN ?? 'http://localhost:5173';
  const jwtSecret = env.JWT_SECRET ?? 'dev-secret';
  const jwtExpiresIn = env.JWT_EXPIRES_IN ?? '7d';

  return {
    port: Number.isFinite(port) && port > 0 ? port : 4000,
    clientOrigin,
    jwtSecret,
    jwtExpiresIn,
  };
}
