import express from "express";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const sql = neon(process.env.DATABASE_URL!);

app.get("/api/projects", async (req, res) => {
  const data = await sql`
        SELECT project_id, name, summary, description, repo_url, docker_url, website_url,
               (end_date IS NOT NULL) AS complete
        FROM Projects
        ORDER BY complete ASC, start_date DESC
    `;
  res.json(data);
});

app.get("/api/officers", async (req, res) => {
  const data = await sql`
        SELECT
            tm.member_id,
            CONCAT(tm.first_name, ' ', tm.last_name) AS name,
            cp.title,
            tm.picture_url
        FROM team tm
        JOIN club_positions cp ON tm.position_id = cp.position_id
        ORDER BY tm.position_id ASC
    `;
  res.json(data);
});

app.get("/api/events", async (req, res) => {
  const data = await sql`
        SELECT * FROM Events ORDER BY event_date DESC
    `;
  res.json(data);
});

app.listen(3001, () => console.log("API server on port 3001"));
