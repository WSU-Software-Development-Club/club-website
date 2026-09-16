import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Password gate for the admin write routes. The password itself is only checked
// once, at login; after that the browser holds a signed, expiring token so the
// secret does not travel with every request.

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Compares two secrets in constant time. Hashing first guarantees equal-length
 * buffers: timingSafeEqual throws on a length mismatch, and that throw would
 * itself leak how long the real secret is.
 */
function secretsMatch(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

function sign(payload: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** True only if the candidate matches ADMIN_PASSWORD. */
export function checkPassword(candidate: unknown): boolean {
  if (typeof candidate !== "string" || candidate.length === 0) return false;

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // Fail closed and loudly, but tell the caller nothing: a misconfigured
    // server should look exactly like a wrong password from the outside.
    console.error("ADMIN_PASSWORD is not set; refusing every login attempt");
    return false;
  }

  return secretsMatch(candidate, expected);
}

export function createToken(): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return { token: `${expiresAt}.${sign(String(expiresAt))}`, expiresAt };
}

/** Verifies an `Authorization: Bearer <expiry>.<signature>` header. */
export function verifyToken(authorization: string | undefined): boolean {
  if (!authorization?.startsWith("Bearer ")) return false;

  const [expiresAt, signature] = authorization.slice("Bearer ".length).split(".");
  if (!expiresAt || !signature) return false;
  if (!secretsMatch(signature, sign(expiresAt))) return false;

  return Number(expiresAt) > Date.now();
}
