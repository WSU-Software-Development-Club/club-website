import { neon } from "@neondatabase/serverless";
import type { EventInput, ProjectInput, TeamInput } from "./validate.js";

// Shared SQL used by both the Vercel functions (api/*.ts) and the local Express
// dev server (server.ts). Keep every query here so the two never drift apart.

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

// Dates and times are rendered to text in SQL rather than left to the driver, so
// they arrive in exactly the shape <input type="date"> and <input type="time">
// expect on the admin page.

export interface ProjectRow {
  project_id: number;
  name: string;
  summary: string;
  description: string;
  start_date: string;
  end_date: string | null;
  repo_url: string | null;
  docker_url: string | null;
  website_url: string | null;
  complete: boolean;
}

export interface TeamRow {
  member_id: number;
  name: string;
  first_name: string;
  last_name: string;
  position: string;
  position_rank: number | null;
  picture_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

export interface EventRow {
  event_id: number;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string | null;
  event_loc: string;
  details_url: string | null;
}

/* -------------------------------------------------------------------------- */
/* Reads                                                                       */
/* -------------------------------------------------------------------------- */

// Each read returns a superset of what the public pages use: the derived fields
// they render, plus the raw columns the admin forms edit. One query serves both.

export async function getProjects(): Promise<ProjectRow[]> {
  const sql = getSql();
  return (await sql`
    SELECT project_id, name, summary, description, repo_url, docker_url, website_url,
           TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
           TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
           (end_date IS NOT NULL) AS complete
    FROM Projects
    ORDER BY complete ASC, Projects.start_date DESC
  `) as ProjectRow[];
}

export async function getTeam(): Promise<TeamRow[]> {
  const sql = getSql();
  return (await sql`
    SELECT
      tm.member_id,
      CONCAT(tm.first_name, ' ', tm.last_name) AS name,
      tm.first_name,
      tm.last_name,
      tm.position,
      tm.position_rank,
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
    SELECT event_id, title, event_loc, details_url,
           TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
           TO_CHAR(start_time::interval, 'HH24:MI') AS start_time,
           TO_CHAR(end_time::interval, 'HH24:MI') AS end_time
    FROM Events
    ORDER BY Events.event_date DESC
  `) as EventRow[];
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                      */
/* -------------------------------------------------------------------------- */

// Every write lists its columns explicitly and passes values through tagged
// templates, so nothing the client sends is ever interpolated as SQL. Updates
// replace the whole row, which keeps the statement static.
//
// Create returns the new id and update returns the affected id (null when no row
// matched, which the handler turns into a 404). The admin page re-fetches the
// list after each write, so there is no need to return the full row.

export async function createEvent(input: EventInput): Promise<{ event_id: number }> {
  const sql = getSql();
  const [row] = (await sql`
    INSERT INTO Events (title, event_date, start_time, end_time, event_loc, details_url)
    VALUES (${input.title}, ${input.event_date}, ${input.start_time}, ${input.end_time},
            ${input.event_loc}, ${input.details_url})
    RETURNING event_id
  `) as { event_id: number }[];
  return row;
}

export async function updateEvent(
  id: number,
  input: EventInput,
): Promise<{ event_id: number } | null> {
  const sql = getSql();
  const [row] = (await sql`
    UPDATE Events SET
      title = ${input.title},
      event_date = ${input.event_date},
      start_time = ${input.start_time},
      end_time = ${input.end_time},
      event_loc = ${input.event_loc},
      details_url = ${input.details_url}
    WHERE event_id = ${id}
    RETURNING event_id
  `) as { event_id: number }[];
  return row ?? null;
}

export async function deleteEvent(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM Events WHERE event_id = ${id} RETURNING event_id`;
  return rows.length > 0;
}

export async function createProject(input: ProjectInput): Promise<{ project_id: number }> {
  const sql = getSql();
  const [row] = (await sql`
    INSERT INTO Projects (name, summary, description, start_date, end_date,
                          repo_url, docker_url, website_url)
    VALUES (${input.name}, ${input.summary}, ${input.description}, ${input.start_date},
            ${input.end_date}, ${input.repo_url}, ${input.docker_url}, ${input.website_url})
    RETURNING project_id
  `) as { project_id: number }[];
  return row;
}

export async function updateProject(
  id: number,
  input: ProjectInput,
): Promise<{ project_id: number } | null> {
  const sql = getSql();
  const [row] = (await sql`
    UPDATE Projects SET
      name = ${input.name},
      summary = ${input.summary},
      description = ${input.description},
      start_date = ${input.start_date},
      end_date = ${input.end_date},
      repo_url = ${input.repo_url},
      docker_url = ${input.docker_url},
      website_url = ${input.website_url}
    WHERE project_id = ${id}
    RETURNING project_id
  `) as { project_id: number }[];
  return row ?? null;
}

export async function deleteProject(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM Projects WHERE project_id = ${id} RETURNING project_id`;
  return rows.length > 0;
}

export async function createTeamMember(input: TeamInput): Promise<{ member_id: number }> {
  const sql = getSql();
  const [row] = (await sql`
    INSERT INTO team (first_name, last_name, position, position_rank,
                      picture_url, linkedin_url, github_url)
    VALUES (${input.first_name}, ${input.last_name}, ${input.position}, ${input.position_rank},
            ${input.picture_url}, ${input.linkedin_url}, ${input.github_url})
    RETURNING member_id
  `) as { member_id: number }[];
  return row;
}

export async function updateTeamMember(
  id: number,
  input: TeamInput,
): Promise<{ member_id: number } | null> {
  const sql = getSql();
  const [row] = (await sql`
    UPDATE team SET
      first_name = ${input.first_name},
      last_name = ${input.last_name},
      position = ${input.position},
      position_rank = ${input.position_rank},
      picture_url = ${input.picture_url},
      linkedin_url = ${input.linkedin_url},
      github_url = ${input.github_url}
    WHERE member_id = ${id}
    RETURNING member_id
  `) as { member_id: number }[];
  return row ?? null;
}

export async function deleteTeamMember(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM team WHERE member_id = ${id} RETURNING member_id`;
  return rows.length > 0;
}
