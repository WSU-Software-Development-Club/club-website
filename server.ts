import express from "express";
import dotenv from "dotenv";
import { handleResource, type ResourceOps } from "./api/_lib/handler.js";
import { handleLogin } from "./api/_lib/login.js";
import {
  createEvent,
  createProject,
  createTeamMember,
  deleteEvent,
  deleteProject,
  deleteTeamMember,
  getEvents,
  getProjects,
  getTeam,
  updateEvent,
  updateProject,
  updateTeamMember,
} from "./api/_lib/queries.js";
import { parseEventInput, parseProjectInput, parseTeamInput } from "./api/_lib/validate.js";

dotenv.config();

// Surface a missing secret at startup rather than at the first request that
// needs it, so a half-filled .env is obvious straight away.
const missing = ["DATABASE_URL", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"].filter(
  (name) => !process.env[name],
);
if (missing.length > 0) {
  console.warn(`Missing from .env: ${missing.join(", ")}. See .env.example.`);
}

const app = express();
app.use(express.json());

/** Mounts a resource on every method, using the same dispatch as the Vercel functions. */
function route<TInput>(path: string, ops: ResourceOps<TInput>) {
  app.all(path, async (req, res) => {
    const { status, body, headers } = await handleResource(ops, {
      method: req.method,
      id: req.query.id as string | undefined,
      body: req.body,
      authorization: req.headers.authorization,
    });

    res.set(headers).status(status).json(body);
  });
}

route("/api/projects", {
  list: getProjects,
  parse: parseProjectInput,
  create: createProject,
  update: updateProject,
  remove: deleteProject,
});

route("/api/team", {
  list: getTeam,
  parse: parseTeamInput,
  create: createTeamMember,
  update: updateTeamMember,
  remove: deleteTeamMember,
});

route("/api/events", {
  list: getEvents,
  parse: parseEventInput,
  create: createEvent,
  update: updateEvent,
  remove: deleteEvent,
});

app.all("/api/login", async (req, res) => {
  const { status, body } = await handleLogin(req.method, req.body);
  res.set("Cache-Control", "no-store").status(status).json(body);
});

app.listen(3001, () => console.log("API server on port 3001"));
