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
  return (
    <section className="garments-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">I Tuoi Capi</p>
          <h2>I QR che puoi modificare in tempo reale</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <Card title="Nessun capo ancora disponibile" subtitle="Crea il primo capo digitale">
          <EmptyState
            title="Parti dalla prima maglietta"
            description="Quando creerai il primo capo, qui vedrai un mock visivo della maglietta, il QR sul retro, il link di destinazione e i controlli per aggiornarlo."
          />
        </Card>
      ) : (
        <div className="garment-grid">
          {items.map((shirt) => (
            <GarmentCard
              key={shirt.shirtId}
              shirt={shirt}
              onSaveTarget={onSaveTarget}
              isBusy={isBusy}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type GarmentCardProps = {
  shirt: Shirt;
  onSaveTarget: (shirtId: string, targetUrl: string) => Promise<void>;
  isBusy: boolean;
};

function GarmentCard({ shirt, onSaveTarget, isBusy }: GarmentCardProps) {
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
    <Card title={shirt.label} subtitle={`Capo ID: ${shirt.shirtId}`}>
      <div className="garment-mock">
        <div className="garment-mock__shirt">
          <div className="garment-mock__neck" />
          <div className="garment-mock__sleeve garment-mock__sleeve--left" />
          <div className="garment-mock__sleeve garment-mock__sleeve--right" />
          <div className="garment-mock__body">
            <span className="garment-mock__label">retro</span>
            <img alt={`QR code ${shirt.label}`} src={qrPreviewUrl} />
          </div>
        </div>
      </div>

      <div className="info-panel">
        <p className="eyebrow">Link del QR stampato</p>
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
        <div className="action-row">
          <button className="primary-button" disabled={isBusy || !targetUrl} type="submit">
            {isBusy ? "Salvataggio..." : "Salva nuovo link"}
          </button>
          {shirt.targetUrl ? (
            <a className="ghost-link" href={shirt.targetUrl} rel="noreferrer" target="_blank">
              Vai al link attuale
            </a>
          ) : null}
        </div>
        <div className="garment-meta">
          <span>Scansioni totali: {shirt.analytics.totalScans}</span>
          <span>Ultimo update: {shirt.updatedAt ?? "mai"}</span>
        </div>
        {feedback ? <p className="success-text">{feedback}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </form>
    </Card>
  );
}
