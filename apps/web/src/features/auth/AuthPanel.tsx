import { useState } from "react";
import { Card } from "../../components/Card";

type AuthPanelProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  isBusy: boolean;
};

export function AuthPanel({ onLogin, isBusy }: AuthPanelProps) {
  const [email, setEmail] = useState("founder@example.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await onLogin(email, password);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Autenticazione non riuscita."
      );
    }
  };

  return (
    <Card title="Founder Access" subtitle="Accedi alla dashboard amministrativa del tuo MVP">
      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email admin</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
        </label>
        <label className="field">
          <span>Password admin</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" disabled={isBusy} type="submit">
          {isBusy ? "Accesso..." : "Accedi"}
        </button>
      </form>
    </Card>
  );
}
