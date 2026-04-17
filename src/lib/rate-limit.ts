/**
 * Rate limiting léger en mémoire (fenêtre glissante).
 *
 * Adapté aux runtimes serverless avec quelques cold starts par minute :
 * la map vit le temps du processus Node. Pour un déploiement multi-region
 * intensif, basculer vers Upstash Redis (`@upstash/ratelimit`).
 *
 * Usage :
 *   const ok = checkRate(`api:chat:${userId}`, { max: 30, windowMs: 60_000 });
 *   if (!ok) return NextResponse.json({ error: "trop de requêtes" }, { status: 429 });
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const STORE: Map<string, Bucket> = new Map();

interface Limit {
  /** Max requests within windowMs */
  max: number;
  /** Window in milliseconds */
  windowMs: number;
}

export function checkRate(key: string, limit: Limit): boolean {
  const now = Date.now();
  const bucket = STORE.get(key);

  if (!bucket || bucket.resetAt < now) {
    STORE.set(key, { count: 1, resetAt: now + limit.windowMs });
    return true;
  }

  if (bucket.count >= limit.max) return false;

  bucket.count += 1;
  return true;
}

export function rateHeaders(key: string, limit: Limit): Record<string, string> {
  const bucket = STORE.get(key);
  return {
    "X-RateLimit-Limit": String(limit.max),
    "X-RateLimit-Remaining": String(
      bucket ? Math.max(0, limit.max - bucket.count) : limit.max
    ),
    "X-RateLimit-Reset": String(
      bucket ? Math.floor(bucket.resetAt / 1000) : Math.floor(Date.now() / 1000)
    ),
  };
}

/**
 * Récupère un identifiant client pour le rate limit.
 * - Authentifié : user.id
 * - Non auth : IP CF/Netlify forwarded
 */
export function clientKey(request: Request, fallback?: string): string {
  if (fallback) return fallback;
  const forwarded =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "anonymous";
}
