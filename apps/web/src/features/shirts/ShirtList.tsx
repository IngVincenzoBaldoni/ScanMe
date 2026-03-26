import { useState } from "react";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { config } from "../../lib/config";
import type { Shirt } from "../../lib/types";

type ShirtListProps = {
  items: Shirt[];
  onSaveTarget: (shirtId: string, targetUrl: string) => Promise<void>;
  isBusy: boolean;
};

const buildRedirectUrl = (shirtId: string) => {
  const baseUrl = config.redirectBaseUrl || window.location.origin;
  return `${baseUrl.replace(/\/$/, "")}/r/${shirtId}`;
};

const buildQrPreviewUrl = (redirectUrl: string) => {
  const params = new URLSearchParams({
    size: "320x320",
    data: redirectUrl
  });

  return `${config.qrPreviewBaseUrl}?${params.toString()}`;
};

export function ShirtList({ items, onSaveTarget, isBusy }: ShirtListProps) {
  if (items.length === 0) {
    return (
      <Card title="Le Tue Magliette" subtitle="Non hai ancora creato nessun QR dinamico">
        <EmptyState
          title="Crea la prima maglietta"
          description="Appena crei il primo QR, qui vedrai il codice da testare, il redirect pubblico stabile e il link di destinazione modificabile."
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
  const redirectUrl = buildRedirectUrl(shirt.shirtId);
  const qrPreviewUrl = buildQrPreviewUrl(redirectUrl);

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
      <div className="qr-preview">
        <img alt={`QR code ${shirt.label}`} src={qrPreviewUrl} />
      </div>

      <div className="info-panel">
        <p className="eyebrow">QR pubblico stabile</p>
        <a className="inline-link" href={redirectUrl} rel="noreferrer" target="_blank">
          {redirectUrl}
        </a>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Link di destinazione attuale</span>
          <input
            placeholder="https://instagram.com/tuoprofilo"
            value={targetUrl}
            onChange={(event) => setTargetUrl(event.target.value)}
          />
        </label>
        <div className="meta-row">
          <span>Creato: {shirt.createdAt ?? "n/d"}</span>
          <span>Ultimo update: {shirt.updatedAt ?? "mai"}</span>
        </div>
        {feedback ? <p className="success-text">{feedback}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <div className="action-row">
          <button className="primary-button" disabled={isBusy || !targetUrl} type="submit">
            {isBusy ? "Salvataggio..." : "Aggiorna destinazione"}
          </button>
          {shirt.targetUrl ? (
            <a className="ghost-link" href={shirt.targetUrl} rel="noreferrer" target="_blank">
              Apri target corrente
            </a>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
