import { config } from "./config";
import type { AuthSession } from "./types";

const STORAGE_KEY = "scanme-auth-session";

const buildMockSession = (email: string): AuthSession => ({
  accessToken: "mock-access-token",
  userId: `demo#${email.toLowerCase()}`,
  email
});

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

    if (!config.useMockAuth) {
      throw new Error(
        "Integrazione Cognito non ancora collegata. Imposta VITE_SCANME_USE_MOCK_AUTH=true oppure integra Amazon Cognito."
      );
    }

    const session = buildMockSession(email);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  async signUp(email: string, password: string): Promise<AuthSession> {
    return this.signIn(email, password);
  },

  signOut(): void {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};
