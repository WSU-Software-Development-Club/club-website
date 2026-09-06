import { neon } from "@neondatabase/serverless";

// Shared SQL used by both the Vercel functions (api/*.ts) and the local Express
// dev server (server.ts). Keep every query here so the two never drift apart.

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export interface ProjectRow {
  project_id: number;
  name: string;
  summary: string;
  description: string;
  repo_url: string | null;
  docker_url: string | null;
  website_url: string | null;
  complete: boolean;
}

export interface TeamRow {
  member_id: number;
  name: string;
  position: string;
  picture_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

export interface EventRow {
  event_id: number;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  event_loc: string;
  details_url: string | null;
  [key: string]: unknown;
}

export async function getProjects(): Promise<ProjectRow[]> {
  const sql = getSql();
  return (await sql`
    SELECT project_id, name, summary, description, repo_url, docker_url, website_url,
           (end_date IS NOT NULL) AS complete
    FROM Projects
    ORDER BY complete ASC, start_date DESC
  `) as ProjectRow[];
}

export async function getTeam(): Promise<TeamRow[]> {
  const sql = getSql();
  return (await sql`
    SELECT
      tm.member_id,
      CONCAT(tm.first_name, ' ', tm.last_name) AS name,
      tm.position,
      tm.picture_url,
      tm.linkedin_url,
      tm.github_url
    FROM team tm
    ORDER BY tm.position_rank ASC
  `) as TeamRow[];
}

export async function getEvents(): Promise<EventRow[]> {
  const sql = getSql();
  return (await sql`
    SELECT * FROM Events ORDER BY event_date DESC
  `) as EventRow[];
}
