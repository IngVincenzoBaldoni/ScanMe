import { useEffect, useState } from "react";
import { AuthPanel } from "./features/auth/AuthPanel";
import { CreateShirtForm } from "./features/shirts/CreateShirtForm";
import { ShirtList } from "./features/shirts/ShirtList";
import { apiClient } from "./lib/api";
import { authClient } from "./lib/auth";
import { config } from "./lib/config";
import type { AuthSession, Shirt } from "./lib/types";

export function App() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [busyAction, setBusyAction] = useState<"auth" | "create" | "save" | "load" | null>("load");
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

  const handleAuth = async (email: string, password: string) => {
    setBusyAction("auth");
    try {
      const nextSession = await authClient.signIn(email, password);
      setSession(nextSession);
    } finally {
      setBusyAction(null);
    }
  };

  const handleCreateShirt = async (label: string, targetUrl: string) => {
    if (!session) {
      throw new Error("Effettua il login prima di creare una maglietta.");
    }

    setBusyAction("create");
    try {
      const response = await apiClient.createShirt(session.accessToken, { label, targetUrl });
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
          Crea il tuo QR dinamico, guarda in dashboard il redirect stabile che stamperai sulla
          maglietta e cambia quando vuoi il link finale che si apre dopo la scansione.
        </p>
        <div className="hero__meta">
          <span>Auth mode: {config.useMockAuth ? "mock founder login" : "admin API login"}</span>
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

          <CreateShirtForm onSubmit={handleCreateShirt} isBusy={busyAction === "create"} />
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
