import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleLogin } from "./_lib/login.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { status, body } = await handleLogin(req.method ?? "GET", req.body);
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}
