import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
        SELECT 
            tm.member_id,
            CONCAT(tm.first_name, ' ', tm.last_name) name,
            cp.title,
            tm.picture_url
        FROM team tm 
        JOIN club_positions cp ON tm.position_id = cp.position_id
        ORDER BY tm.position_id ASC;
    `;
  res.setHeader("Cache-Control", "s-maxage=1200, stale-while-revalidate");
  res.json(data);
}
