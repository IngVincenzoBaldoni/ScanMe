import { useEffect, useState } from "react";
import { AuthPanel } from "./features/auth/AuthPanel";
import { ClaimShirtForm } from "./features/shirts/ClaimShirtForm";
import { ShirtList } from "./features/shirts/ShirtList";
import { apiClient } from "./lib/api";
import { authClient } from "./lib/auth";
import { config } from "./lib/config";
import type { AuthSession, Shirt } from "./lib/types";

export function App() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [busyAction, setBusyAction] = useState<"auth" | "claim" | "save" | "load" | null>("load");
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    const existingSession = authClient.getSession();
    setSession(existingSession);
    setBusyAction(null);
  }, []);

  useEffect(() => {
    if (!session) {
      setShirts([]);
      return;
    }

    const run = async () => {
      setBusyAction("load");
      setPageError(null);

      try {
        const response = await apiClient.listShirts(session.accessToken);
        setShirts(response.items);
      } catch (error) {
        setPageError(error instanceof Error ? error.message : "Impossibile caricare le magliette.");
      } finally {
        setBusyAction(null);
      }
    };

    void run();
  }, [session]);

  const handleAuth = async (
    email: string,
    password: string,
    mode: "signin" | "signup"
  ) => {
    setBusyAction("auth");
    const nextSession =
      mode === "signin"
        ? await authClient.signIn(email, password)
        : await authClient.signUp(email, password);
    setSession(nextSession);
    setBusyAction(null);
  };

  const handleClaim = async (activationCode: string) => {
    if (!session) {
      throw new Error("Effettua il login prima di collegare una maglietta.");
    }

    setBusyAction("claim");
    try {
      const response = await apiClient.claimShirt(session.accessToken, { activationCode });
      setShirts((currentItems) => [response.item, ...currentItems]);
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveTarget = async (shirtId: string, targetUrl: string) => {
    if (!session) {
      throw new Error("Effettua il login prima di aggiornare il link.");
    }

    setBusyAction("save");
    try {
      const response = await apiClient.updateTarget(session.accessToken, shirtId, { targetUrl });
      setShirts((currentItems) =>
        currentItems.map((item) => (item.shirtId === shirtId ? response.item : item))
      );
    } finally {
      setBusyAction(null);
    }
  };

  const handleLogout = () => {
    authClient.signOut();
    setSession(null);
    setShirts([]);
  };

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">ScanMe</p>
        <h1>Il QR della tua maglietta cambia con te.</h1>
        <p className="lead">
          Collega la maglietta, scegli il link del giorno e lascia che ogni scansione apra sempre
          l&apos;ultima destinazione che hai deciso.
        </p>
        <div className="hero__meta">
          <span>Frontend mode: {config.useMockAuth ? "mock auth" : "Cognito pending"}</span>
          <span>API: {config.apiBaseUrl || "mock browser mode"}</span>
        </div>
      </section>

      {!session ? (
        <AuthPanel onLogin={handleAuth} isBusy={busyAction === "auth"} />
      ) : (
        <div className="dashboard">
          <section className="dashboard__header">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h2>{session.email}</h2>
            </div>
            <button className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </section>

          {pageError ? <p className="error-banner">{pageError}</p> : null}

          <ClaimShirtForm onSubmit={handleClaim} isBusy={busyAction === "claim"} />
          <ShirtList
            items={shirts}
            onSaveTarget={handleSaveTarget}
            isBusy={busyAction === "save" || busyAction === "load"}
          />
        </div>
      )}
    </main>
  );
}
