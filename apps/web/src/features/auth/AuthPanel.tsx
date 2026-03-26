import { useState } from "react";
import { Card } from "../../components/Card";

type AuthPanelProps = {
  onLogin: (email: string, password: string, mode: "signin" | "signup") => Promise<void>;
  isBusy: boolean;
};

export function AuthPanel({ onLogin, isBusy }: AuthPanelProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("demo@scanme.app");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await onLogin(email, password, mode);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Autenticazione non riuscita."
      );
    }
  };

  return (
    <Card
      title="Owner Access"
      subtitle="Accedi e gestisci il QR della tua maglietta"
      action={
        <button className="ghost-button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
          {mode === "signin" ? "Crea account" : "Ho gia un account"}
        </button>
      }
    >
      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" disabled={isBusy} type="submit">
          {isBusy ? "Attendere..." : mode === "signin" ? "Accedi" : "Registrati"}
        </button>
      </form>
    </Card>
  );
}
