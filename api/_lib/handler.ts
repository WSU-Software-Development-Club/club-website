import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyToken } from "./auth.js";
import { ValidationError } from "./validate.js";

// One resource = one public GET plus authenticated POST / PATCH / DELETE. The
// dispatch lives in handleResource() rather than in either entry point, so the
// Vercel functions (api/*.ts) and the Express dev server (server.ts) are thin
// adapters over identical logic and cannot drift apart.

export interface ResourceOps<TInput> {
  list(): Promise<unknown[]>;
  parse(body: unknown): TInput;
  create(input: TInput): Promise<unknown>;
  update(id: number, input: TInput): Promise<unknown | null>;
  remove(id: number): Promise<boolean>;
}

export interface ApiRequest {
  method: string;
  id?: string | string[];
  body?: unknown;
  authorization?: string;
}

export interface ApiResponse {
  status: number;
  body: unknown;
  headers: Record<string, string>;
}

// Short enough that a leader who adds an event sees it on the public page almost
// immediately, long enough to still spare the database most of the traffic.
const READ_CACHE = "s-maxage=60, stale-while-revalidate=300";
const NO_CACHE = "no-store";

function requireId(id: ApiRequest["id"]): number {
  const raw = Array.isArray(id) ? id[0] : id;
  const parsed = Number(raw);
  if (!raw || !Number.isInteger(parsed)) {
    throw new ValidationError("A numeric ?id= is required");
  }
  return parsed;
}

export async function handleResource<TInput>(
  ops: ResourceOps<TInput>,
  req: ApiRequest,
): Promise<ApiResponse> {
  try {
    if (req.method === "GET") {
      return { status: 200, body: await ops.list(), headers: { "Cache-Control": READ_CACHE } };
    }

    if (req.method !== "POST" && req.method !== "PATCH" && req.method !== "DELETE") {
      return { status: 405, body: { error: "Method not allowed" }, headers: {} };
    }

    // Everything past here writes, so reject before parsing anything.
    if (!verifyToken(req.authorization)) {
      return {
        status: 401,
        body: { error: "Unauthorized" },
        headers: { "Cache-Control": NO_CACHE },
      };
    }

    const headers = { "Cache-Control": NO_CACHE };

    if (req.method === "POST") {
      return { status: 201, body: await ops.create(ops.parse(req.body)), headers };
    }

    const id = requireId(req.id);

    if (req.method === "PATCH") {
      const updated = await ops.update(id, ops.parse(req.body));
      if (!updated) return { status: 404, body: { error: "Not found" }, headers };
      return { status: 200, body: updated, headers };
    }

    const removed = await ops.remove(id);
    if (!removed) return { status: 404, body: { error: "Not found" }, headers };
    return { status: 200, body: { ok: true }, headers };
  } catch (err) {
    if (err instanceof ValidationError) {
      return { status: 400, body: { error: err.message }, headers: { "Cache-Control": NO_CACHE } };
    }
    // Anything unexpected stays server-side; the client gets nothing useful.
    console.error(err);
    return { status: 500, body: { error: "Internal server error" }, headers: {} };
  }
}

/** Adapts a resource to a Vercel serverless function. */
export function vercelResource<TInput>(ops: ResourceOps<TInput>) {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    const { status, body, headers } = await handleResource(ops, {
      method: req.method ?? "GET",
      id: req.query.id,
      body: req.body,
      authorization: req.headers.authorization,
    });

    for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
    res.status(status).json(body);
  };
}
