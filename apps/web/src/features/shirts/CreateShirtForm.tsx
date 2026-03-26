import { useState } from "react";
import { Card } from "../../components/Card";

type CreateShirtFormProps = {
  onSubmit: (label: string, targetUrl: string) => Promise<void>;
  isBusy: boolean;
};

export function CreateShirtForm({ onSubmit, isBusy }: CreateShirtFormProps) {
  const [label, setLabel] = useState("ScanMe Founder Tee");
  const [targetUrl, setTargetUrl] = useState("https://example.com/my-profile");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await onSubmit(label, targetUrl);
      setMessage("QR creato con successo.");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Creazione non riuscita."
      );
    }
  };

  return (
    <Card title="Nuova Maglietta" subtitle="Crea il tuo primo QR dinamico da testare">
      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nome maglietta</span>
          <input value={label} onChange={(event) => setLabel(event.target.value)} />
        </label>
        <label className="field">
          <span>Link iniziale</span>
          <input value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} />
        </label>
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" disabled={isBusy} type="submit">
          {isBusy ? "Creazione..." : "Crea QR"}
        </button>
      </form>
    </Card>
  );
}
