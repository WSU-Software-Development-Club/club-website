import { checkPassword, createToken } from "./auth.js";

// Trades the admin password for a signed, expiring session token. Shared by the
// Vercel function (api/login.ts) and the Express dev server, like every other
// route here.

const FAILURE_DELAY_MS = 250;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function handleLogin(
  method: string,
  body: unknown,
): Promise<{ status: number; body: unknown }> {
  if (method !== "POST") {
    return { status: 405, body: { error: "Method not allowed" } };
  }

  const password = (body as { password?: unknown } | null)?.password;

  if (!checkPassword(password)) {
    // A small, fixed delay. Per-instance rate limiting is unreliable on
    // serverless, so this only takes the edge off scripted guessing -- a long
    // random ADMIN_PASSWORD is what actually protects this route.
    await sleep(FAILURE_DELAY_MS);
    return { status: 401, body: { error: "Invalid password" } };
  }

  try {
    return { status: 200, body: createToken() };
  } catch (err) {
    // The password was right but the token could not be signed, which in
    // practice means ADMIN_SESSION_SECRET is missing. Without this branch the
    // throw escapes as an HTML 500 and the login screen just says the password
    // was wrong, which sends whoever set the site up looking in the wrong place.
    console.error("Admin login could not issue a token:", err);
    return {
      status: 500,
      body: { error: "Admin login is not configured on the server. Check the server logs." },
    };
  }
}
