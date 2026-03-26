import { config } from "./config";
import type { AuthSession } from "./types";

const STORAGE_KEY = "scanme-auth-session";

const buildMockSession = (email: string): AuthSession => ({
  accessToken: "mock-admin-token",
  userId: "admin",
  email
});

const saveSession = (session: AuthSession) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const authClient = {
  getSession(): AuthSession | null {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<AuthSession> {
    if (!email || !password) {
      throw new Error("Email e password sono obbligatorie.");
    }

    if (!config.apiBaseUrl || config.useMockAuth) {
      const session = buildMockSession(email);
      saveSession(session);
      return session;
    }

    const response = await fetch(`${config.apiBaseUrl}/v1/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const body = (await response.json()) as {
      message?: string;
      session?: { accessToken: string; email: string };
    };

    if (!response.ok || !body.session) {
      throw new Error(body.message ?? "Autenticazione non riuscita.");
    }

    const session: AuthSession = {
      accessToken: body.session.accessToken,
      userId: "admin",
      email: body.session.email
    };

    saveSession(session);
    return session;
  },

  signOut(): void {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};
