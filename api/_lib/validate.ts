// Request-body validation for the admin write routes. Kept out of queries.ts so
// that file stays purely SQL, and shared by the Vercel functions and server.ts
// so both reject the same input for the same reason.

/** A bad request body. The handler turns this into a 400 with its message. */
export class ValidationError extends Error {}

export interface EventInput {
  title: string;
  event_date: string;
  start_time: string;
  end_time: string | null;
  event_loc: string;
  details_url: string | null;
}

export interface ProjectInput {
  name: string;
  summary: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  repo_url: string | null;
  docker_url: string | null;
  website_url: string | null;
}

export interface TeamInput {
  first_name: string;
  last_name: string;
  position: string;
  position_rank: number | null;
  picture_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/;

type Body = Record<string, unknown>;

function asBody(body: unknown): Body {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ValidationError("Expected a JSON object");
  }
  return body as Body;
}

/** Trims a field, treating a blank string the same as a missing one. */
function trimmed(body: Body, key: string, label: string): string | null {
  const value = body[key];
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new ValidationError(`${label} must be text`);
  return value.trim() || null;
}

function checkLength(value: string, label: string, maxLength?: number) {
  if (maxLength !== undefined && value.length > maxLength) {
    throw new ValidationError(`${label} must be ${maxLength} characters or fewer`);
  }
  return value;
}

function required(body: Body, key: string, label: string, maxLength?: number): string {
  const value = trimmed(body, key, label);
  if (value === null) throw new ValidationError(`${label} is required`);
  return checkLength(value, label, maxLength);
}

function optional(body: Body, key: string, label: string, maxLength?: number): string | null {
  const value = trimmed(body, key, label);
  return value === null ? null : checkLength(value, label, maxLength);
}

function optionalUrl(body: Body, key: string, label: string): string | null {
  const value = optional(body, key, label);
  if (value === null) return null;
  try {
    new URL(value);
  } catch {
    throw new ValidationError(`${label} must be a full URL, starting with https://`);
  }
  return value;
}

function match(value: string, pattern: RegExp, label: string, expected: string): string {
  if (!pattern.test(value)) throw new ValidationError(`${label} must be ${expected}`);
  return value;
}

function requiredDate(body: Body, key: string, label: string): string {
  return match(required(body, key, label), DATE_PATTERN, label, "a date (YYYY-MM-DD)");
}

function optionalDate(body: Body, key: string, label: string): string | null {
  const value = optional(body, key, label);
  return value === null ? null : match(value, DATE_PATTERN, label, "a date (YYYY-MM-DD)");
}

function requiredTime(body: Body, key: string, label: string): string {
  return match(required(body, key, label), TIME_PATTERN, label, "a time (HH:MM)");
}

function optionalTime(body: Body, key: string, label: string): string | null {
  const value = optional(body, key, label);
  return value === null ? null : match(value, TIME_PATTERN, label, "a time (HH:MM)");
}

function optionalInt(body: Body, key: string, label: string): number | null {
  const value = body[key];
  if (value === undefined || value === null || value === "") return null;

  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isInteger(parsed)) throw new ValidationError(`${label} must be a whole number`);
  return parsed;
}

export function parseEventInput(input: unknown): EventInput {
  const body = asBody(input);
  return {
    title: required(body, "title", "Title"),
    event_date: requiredDate(body, "event_date", "Date"),
    start_time: requiredTime(body, "start_time", "Start time"),
    end_time: optionalTime(body, "end_time", "End time"),
    event_loc: required(body, "event_loc", "Location"),
    details_url: optionalUrl(body, "details_url", "Details link"),
  };
}

export function parseProjectInput(input: unknown): ProjectInput {
  const body = asBody(input);
  return {
    name: required(body, "name", "Title"),
    // summary is VARCHAR(40) in Postgres, so an over-long value has to be a
    // readable 400 here rather than a 500 from the driver.
    summary: optional(body, "summary", "Summary", 40),
    description: optional(body, "description", "Description"),
    start_date: requiredDate(body, "start_date", "Start date"),
    end_date: optionalDate(body, "end_date", "End date"),
    repo_url: optionalUrl(body, "repo_url", "GitHub link"),
    docker_url: optionalUrl(body, "docker_url", "Docker link"),
    website_url: optionalUrl(body, "website_url", "Website link"),
  };
}

export function parseTeamInput(input: unknown): TeamInput {
  const body = asBody(input);
  return {
    first_name: required(body, "first_name", "First name"),
    last_name: required(body, "last_name", "Last name"),
    position: required(body, "position", "Position"),
    position_rank: optionalInt(body, "position_rank", "Display order"),
    picture_url: optionalUrl(body, "picture_url", "Picture link"),
    linkedin_url: optionalUrl(body, "linkedin_url", "LinkedIn link"),
    github_url: optionalUrl(body, "github_url", "GitHub link"),
  };
}
