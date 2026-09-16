import type { Row } from "@/lib/adminApi";

// All three admin tables are flat, so each one is described as data and rendered
// by the single form in ResourceEditor rather than by three near-identical
// components. Keep these in step with the validators in api/_lib/validate.ts.

export interface FieldSpec {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "time" | "number" | "url";
  required?: boolean;
  maxLength?: number;
  help?: string;
}

export interface ResourceSpec {
  /** Also the API path: /api/<resource>. */
  resource: string;
  tab: string;
  noun: string;
  idKey: string;
  fields: FieldSpec[];
  /** Row label shown in the list. */
  summarize(row: Row): { title: string; detail: string };
}

const text = (row: Row, key: string) => (row[key] == null ? "" : String(row[key]));

export const eventSpec: ResourceSpec = {
  resource: "events",
  tab: "Events",
  noun: "event",
  idKey: "event_id",
  fields: [
    { name: "title", label: "Event name", type: "text", required: true },
    { name: "event_loc", label: "Location", type: "text", required: true },
    { name: "event_date", label: "Date", type: "date", required: true },
    { name: "start_time", label: "Start time", type: "time", required: true },
    { name: "end_time", label: "End time", type: "time", help: "Optional." },
    {
      name: "details_url",
      label: "Details link",
      type: "url",
      help: "Optional. Shown on the events page.",
    },
  ],
  summarize: (row) => ({
    title: text(row, "title"),
    detail: [text(row, "event_date"), text(row, "event_loc")].filter(Boolean).join(" · "),
  }),
};

export const projectSpec: ResourceSpec = {
  resource: "projects",
  tab: "Projects",
  noun: "project",
  idKey: "project_id",
  fields: [
    { name: "name", label: "Title", type: "text", required: true },
    {
      name: "summary",
      label: "Summary",
      type: "text",
      maxLength: 40,
      help: "One short line, 40 characters max.",
    },
    { name: "description", label: "Description", type: "textarea" },
    { name: "start_date", label: "Start date", type: "date", required: true },
    {
      name: "end_date",
      label: "End date",
      type: "date",
      help: "Leave blank while the project is still in progress. Filling it in marks the project complete.",
    },
    { name: "repo_url", label: "GitHub link", type: "url" },
    { name: "docker_url", label: "Docker link", type: "url" },
    { name: "website_url", label: "Website link", type: "url" },
  ],
  summarize: (row) => ({
    title: text(row, "name"),
    detail: row.complete ? "Complete" : "In progress",
  }),
};

export const teamSpec: ResourceSpec = {
  resource: "team",
  tab: "Team",
  noun: "team member",
  idKey: "member_id",
  fields: [
    { name: "first_name", label: "First name", type: "text", required: true },
    { name: "last_name", label: "Last name", type: "text", required: true },
    { name: "position", label: "Position", type: "text", required: true },
    {
      name: "position_rank",
      label: "Display order",
      type: "number",
      help: "Lower numbers appear first on the team page.",
    },
    { name: "picture_url", label: "Picture link", type: "url", help: "Optional headshot URL." },
    { name: "linkedin_url", label: "LinkedIn link", type: "url" },
    { name: "github_url", label: "GitHub link", type: "url" },
  ],
  summarize: (row) => ({
    title: [text(row, "first_name"), text(row, "last_name")].filter(Boolean).join(" "),
    detail: text(row, "position"),
  }),
};

export const adminSpecs: ResourceSpec[] = [eventSpec, projectSpec, teamSpec];
