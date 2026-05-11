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

app.get("/api/team", async (req, res) => {
  const data = await sql`
        SELECT
            tm.member_id,
            CONCAT(tm.first_name, ' ', tm.last_name) AS name,
            tm.position,
            tm.picture_url,
            tm.linkedin_url,
            tm.github_url
        FROM team tm
        ORDER BY tm.position_rank ASC
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
