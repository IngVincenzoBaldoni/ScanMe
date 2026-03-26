import { useState } from "react";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import type { Shirt } from "../../lib/types";

type ShirtListProps = {
  items: Shirt[];
  onSaveTarget: (shirtId: string, targetUrl: string) => Promise<void>;
  isBusy: boolean;
};

export function ShirtList({ items, onSaveTarget, isBusy }: ShirtListProps) {
  if (items.length === 0) {
    return (
      <Card title="Shirts" subtitle="Nessuna maglietta ancora collegata">
        <EmptyState
          title="Primo step: claim"
          description="Inserisci il codice di attivazione della tua maglietta per iniziare a cambiare il QR."
        />
      </Card>
    );
  }

  return (
    <div className="shirt-grid">
      {items.map((shirt) => (
        <ShirtCard key={shirt.shirtId} shirt={shirt} onSaveTarget={onSaveTarget} isBusy={isBusy} />
      ))}
    </div>
  );
}

type ShirtCardProps = {
  shirt: Shirt;
  onSaveTarget: (shirtId: string, targetUrl: string) => Promise<void>;
  isBusy: boolean;
};

function ShirtCard({ shirt, onSaveTarget, isBusy }: ShirtCardProps) {
  const [targetUrl, setTargetUrl] = useState(shirt.targetUrl ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setError(null);

    try {
      await onSaveTarget(shirt.shirtId, targetUrl);
      setFeedback("Link aggiornato.");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Aggiornamento non riuscito."
      );
    }
  };

  return (
    <Card title={shirt.label} subtitle={`ID: ${shirt.shirtId}`}>
      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Target URL</span>
          <input
            placeholder="https://instagram.com/tuoprofilo"
            value={targetUrl}
            onChange={(event) => setTargetUrl(event.target.value)}
          />
        </label>
        <div className="meta-row">
          <span className="badge">{shirt.status}</span>
          <span>Ultimo update: {shirt.updatedAt ?? "mai"}</span>
        </div>
        {feedback ? <p className="success-text">{feedback}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" disabled={isBusy || !targetUrl} type="submit">
          {isBusy ? "Salvataggio..." : "Salva link"}
        </button>
      </form>
    </Card>
  );
}
