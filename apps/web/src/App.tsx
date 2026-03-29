import { useEffect, useMemo, useState } from "react";
import { AnalyticsSection } from "./features/analytics/AnalyticsSection";
import { AuthPanel } from "./features/auth/AuthPanel";
import { PublicPortal } from "./features/public/PublicPortal";
import { CreateShirtForm } from "./features/shirts/CreateShirtForm";
import { ShirtList } from "./features/shirts/ShirtList";
import { apiClient } from "./lib/api";
import { authClient } from "./lib/auth";
import { config } from "./lib/config";
import type { AuthSession, CreateShirtPayload, Shirt } from "./lib/types";

const getPortalMode = () => {
  return window.location.pathname.startsWith("/internal") ? "internal" : "public";
};

export function App() {
  const portalMode = useMemo(() => getPortalMode(), []);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [busyAction, setBusyAction] = useState<"auth" | "create" | "save" | "load" | null>("load");
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (portalMode !== "internal") {
      setBusyAction(null);
      return;
    }

    const existingSession = authClient.getSession();
    setSession(existingSession);
    setBusyAction(null);
  }, [portalMode]);

  useEffect(() => {
    if (portalMode !== "internal" || !session) {
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
        setPageError(error instanceof Error ? error.message : "Impossibile caricare i digital twin.");
      } finally {
        setBusyAction(null);
      }
    };

    void run();
  }, [portalMode, session]);

  const handleAuth = async (email: string, password: string) => {
    setBusyAction("auth");
    try {
      const nextSession = await authClient.signIn(email, password);
      setSession(nextSession);
    } finally {
      setBusyAction(null);
    }
  };

  const handleCreateShirt = async (payload: CreateShirtPayload) => {
    if (!session) {
      throw new Error("Effettua il login prima di creare un digital twin.");
    }

    setBusyAction("create");
    try {
      const response = await apiClient.createShirt(session.accessToken, payload);
      setShirts((currentItems) => [response.item, ...currentItems]);
      return response.item;
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

  if (portalMode === "public") {
    return <PublicPortal />;
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">ScanMe Internal</p>
        <h1>Portale interno per creare il digital twin di ogni maglietta.</h1>
        <p className="lead">
          Questo spazio e' separato dal portale pubblico: qui registri ordini, generi QR
          stampabili, allinei Printify e monitori i capi gia' in circolazione.
        </p>
        <div className="hero__meta">
          <span>Auth mode: {config.useMockAuth ? "mock founder login" : "admin API login"}</span>
          <span>API: {config.apiBaseUrl || "mock browser mode"}</span>
          <a className="ghost-link ghost-link--light" href="/">
            Vai al portale pubblico
          </a>
        </div>
      </section>

      {!session ? (
        <AuthPanel onLogin={handleAuth} isBusy={busyAction === "auth"} />
      ) : (
        <div className="dashboard">
          <section className="dashboard__header">
            <div>
              <p className="eyebrow">Internal Portal</p>
              <h2>Founder operations desk</h2>
              <p className="dashboard__subcopy">
                Crea i digital twin, traccia dati ordine e cliente, scarica il QR pronto per
                Printify e osserva le scansioni che arrivano dai capi gia' stampati.
              </p>
            </div>
            <button className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </section>

          {pageError ? <p className="error-banner">{pageError}</p> : null}

          <CreateShirtForm onSubmit={handleCreateShirt} isBusy={busyAction === "create"} />
          <AnalyticsSection items={shirts} />
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
