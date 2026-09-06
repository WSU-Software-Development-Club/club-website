import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Wraps a query function as a Vercel handler with caching and error handling,
 * so a database failure returns a clean 500 instead of a stack trace.
 */
export function jsonHandler<T>(query: () => Promise<T>) {
  return async function handler(_req: VercelRequest, res: VercelResponse) {
    try {
      const data = await query();
      res.setHeader("Cache-Control", "s-maxage=1200, stale-while-revalidate");
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
