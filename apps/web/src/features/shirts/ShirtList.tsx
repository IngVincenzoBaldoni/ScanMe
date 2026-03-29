import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { config } from "../../lib/config";
import { buildQrPreviewUrl, buildRedirectUrl, downloadQrSvg } from "../../lib/qr";
import type { ProductionStatus, Shirt } from "../../lib/types";

type ShirtListProps = {
  items: Shirt[];
  onSaveTarget: (shirtId: string, targetUrl: string) => Promise<void>;
  isBusy: boolean;
};

const statusLabelMap: Record<ProductionStatus, string> = {
  draft: "Draft",
  qr_ready: "QR pronto",
  sent_to_printify: "Inviato a Printify",
  in_production: "In produzione",
  shipped: "Spedito",
  active: "Attivo"
};

export function ShirtList({ items, onSaveTarget, isBusy }: ShirtListProps) {
  return (
    <section className="garments-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Digital Twins</p>
          <h2>Catalogo interno capi e QR</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <Card title="Nessun capo ancora disponibile" subtitle="Crea il primo digital twin">
          <EmptyState
            title="Il portale interno e' pronto"
            description="Quando creerai il primo twin, qui vedrai i dati ordine, il mock della maglietta con QR, il redirect stampabile e tutti i dettagli operativi da tenere allineati con Shopify e Printify."
          />
        </Card>
      ) : (
        <div className="garment-grid garment-grid--wide">
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
  const redirectUrl = buildRedirectUrl(config.redirectBaseUrl || window.location.origin, shirt.shirtId);
  const qrPreviewUrl = buildQrPreviewUrl(config.qrPreviewBaseUrl, redirectUrl);

  useEffect(() => {
    setTargetUrl(shirt.targetUrl ?? "");
  }, [shirt.targetUrl]);

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
    <Card title={shirt.label} subtitle={`Twin ID: ${shirt.shirtId}`}>
      <div className="twin-card__header">
        <span className={`status-pill status-pill--${shirt.operations.productionStatus}`}>
          {statusLabelMap[shirt.operations.productionStatus]}
        </span>
        <span className="status-pill status-pill--muted">{shirt.commerce.salesChannel}</span>
      </div>

      <div className="twin-card__layout">
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

        <div className="twin-card__sections">
          <div className="info-panel">
            <p className="eyebrow">Redirect da stampare</p>
            <a className="inline-link" href={redirectUrl} rel="noreferrer" target="_blank">
              {redirectUrl}
            </a>
          </div>

          <div className="mini-grid">
            <InfoBlock
              title="Ordine"
              rows={[
                ["Reference", shirt.commerce.orderReference],
                ["Cliente", shirt.commerce.customerName],
                ["Email", shirt.commerce.customerEmail]
              ]}
            />
            <InfoBlock
              title="Prodotto"
              rows={[
                ["Modello", shirt.product.model],
                ["Taglia", shirt.product.size],
                ["Colore", shirt.product.color]
              ]}
            />
            <InfoBlock
              title="Produzione"
              rows={[
                ["Provider", shirt.product.printProvider],
                ["Placement", shirt.product.placement],
                ["Stato", statusLabelMap[shirt.operations.productionStatus]]
              ]}
            />
            <InfoBlock
              title="Analytics"
              rows={[
                ["Scansioni", String(shirt.analytics.totalScans)],
                ["Ultimo update", shirt.updatedAt ?? "mai"],
                ["Ultima scan", shirt.analytics.lastScannedAt ?? "mai"]
              ]}
            />
          </div>

          <div className="info-panel">
            <p className="eyebrow">Link chiesto dal cliente in checkout</p>
            <a
              className="inline-link"
              href={shirt.commerce.requestedUrl}
              rel="noreferrer"
              target="_blank"
            >
              {shirt.commerce.requestedUrl}
            </a>
          </div>

          {shirt.operations.notes ? (
            <div className="info-panel">
              <p className="eyebrow">Note operative</p>
              <p className="note-copy">{shirt.operations.notes}</p>
            </div>
          ) : null}
        </div>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Link attivo attuale del digital twin</span>
          <input
            placeholder="https://instagram.com/tuoprofilo"
            value={targetUrl}
            onChange={(event) => setTargetUrl(event.target.value)}
          />
        </label>
        <div className="action-row">
          <button className="primary-button" disabled={isBusy || !targetUrl} type="submit">
            {isBusy ? "Salvataggio..." : "Salva link live"}
          </button>
          <button
            className="ghost-button"
            onClick={() => downloadQrSvg(redirectUrl, `${shirt.shirtId}.svg`)}
            type="button"
          >
            Scarica QR SVG
          </button>
          {shirt.targetUrl ? (
            <a className="ghost-link" href={shirt.targetUrl} rel="noreferrer" target="_blank">
              Apri link live
            </a>
          ) : null}
        </div>
        {feedback ? <p className="success-text">{feedback}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </form>
    </Card>
  );
}

type InfoBlockProps = {
  title: string;
  rows: [string, string][];
};

function InfoBlock({ title, rows }: InfoBlockProps) {
  return (
    <div className="info-block">
      <p className="eyebrow">{title}</p>
      <div className="info-block__rows">
        {rows.map(([label, value]) => (
          <div className="meta-row" key={label}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
