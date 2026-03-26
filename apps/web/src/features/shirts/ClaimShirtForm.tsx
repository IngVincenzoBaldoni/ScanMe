import { useState } from "react";
import { Card } from "../../components/Card";

type ClaimShirtFormProps = {
  onSubmit: (activationCode: string) => Promise<void>;
  isBusy: boolean;
};

export function ClaimShirtForm({ onSubmit, isBusy }: ClaimShirtFormProps) {
  const [activationCode, setActivationCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await onSubmit(activationCode);
      setMessage("Maglietta collegata con successo.");
      setActivationCode("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Claim non riuscito."
      );
    }
  };

  return (
    <Card title="Claim" subtitle="Collega una nuova maglietta al tuo profilo">
      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Activation code</span>
          <input
            placeholder="ABC123-PLACEHOLDER"
            value={activationCode}
            onChange={(event) => setActivationCode(event.target.value.toUpperCase())}
          />
        </label>
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" disabled={isBusy || !activationCode} type="submit">
          {isBusy ? "Collegamento..." : "Collega maglietta"}
        </button>
      </form>
    </Card>
  );
}
