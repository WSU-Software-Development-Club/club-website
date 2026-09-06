import express from "express";
import dotenv from "dotenv";
import { getEvents, getProjects, getTeam } from "./api/_lib/queries.js";

dotenv.config();

const app = express();

function route<T>(path: string, query: () => Promise<T>) {
  app.get(path, async (_req, res) => {
    try {
      res.json(await query());
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

route("/api/projects", getProjects);
route("/api/team", getTeam);
route("/api/events", getEvents);

app.listen(3001, () => console.log("API server on port 3001"));
