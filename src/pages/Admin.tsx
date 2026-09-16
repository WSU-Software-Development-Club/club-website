import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import ClubFooter from "@/components/ui/ClubFooter";
import { Card } from "@/components/ui/card";
import ResourceEditor from "@/components/admin/ResourceEditor";
import { adminSpecs } from "@/components/admin/fieldSpecs";
import { clearToken, getToken, login } from "@/lib/adminApi";

/**
 * Password-gated editor for the events, projects, and team tables, so club
 * leaders can update the site without opening the Neon console.
 */
export default function Admin() {
  const [signedIn, setSignedIn] = useState(() => getToken() !== null);
  const [activeTab, setActiveTab] = useState(0);

  // Keep the page out of search results. Paired with public/robots.txt -- the
  // password is the actual protection, this just avoids an awkward listing.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const handleSessionExpired = useCallback(() => {
    clearToken();
    setSignedIn(false);
  }, []);

  function handleSignOut() {
    clearToken();
    setSignedIn(false);
  }

  if (!signedIn) {
    return <AdminLogin onSignedIn={() => setSignedIn(true)} />;
  }

  const spec = adminSpecs[activeTab];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow mt-27 mb-10">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-crimson">Site Admin</h1>
              <p className="text-black80">Changes here go live on the public site.</p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="border text-black80 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100"
            >
              Log out
            </button>
          </div>

          {/* Section switcher */}
          <div className="flex gap-2 border-b mb-6" role="tablist">
            {adminSpecs.map((option, index) => (
              <button
                key={option.resource}
                type="button"
                role="tab"
                aria-selected={index === activeTab}
                onClick={() => setActiveTab(index)}
                className={`px-5 py-2.5 font-medium cursor-pointer border-b-2 -mb-px transition-colors ${
                  index === activeTab
                    ? "border-crimson text-crimson"
                    : "border-transparent text-black80 hover:text-crimson"
                }`}
              >
                {option.tab}
              </button>
            ))}
          </div>

          {/* Remounts on tab change so each section starts with a clean form */}
          <ResourceEditor key={spec.resource} spec={spec} onSessionExpired={handleSessionExpired} />
        </div>
      </main>

      <ClubFooter />
    </div>
  );
}

function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await login(password);
      setPassword("");
      onSignedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow mt-27 flex items-start justify-center px-4">
        <Card className="w-full max-w-md px-6">
          <h1 className="text-3xl font-bold text-crimson">Site Admin</h1>
          <p className="text-black80">Enter the admin password to manage the site.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block font-medium text-black80 mb-1">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crimson"
              />
            </div>

            {error && (
              <p role="alert" className="text-wsu_red font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-crimson text-white px-5 py-2 rounded-md cursor-pointer hover:bg-wsu_red disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {busy ? "Checking..." : "Sign in"}
            </button>
          </form>
        </Card>
      </main>

      <ClubFooter />
    </div>
  );
}
