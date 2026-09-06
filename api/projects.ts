import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
        SELECT project_id, name, summary, description, repo_url, docker_url, website_url,
               (end_date IS NOT NULL) AS complete
        FROM Projects
        ORDER BY complete ASC, start_date DESC
    `;
  res.setHeader("Cache-Control", "s-maxage=1200, stale-while-revalidate");
  res.json(data);
}
