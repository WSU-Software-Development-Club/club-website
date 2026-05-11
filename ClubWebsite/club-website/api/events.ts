import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
        SELECT * FROM Events ORDER BY event_date DESC
    `;
  res.setHeader("Cache-Control", "s-maxage=1200, stale-while-revalidate");
  res.json(data);
}
