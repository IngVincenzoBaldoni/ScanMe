import { useState } from "react";
import { Card } from "../../components/Card";
import { config } from "../../lib/config";
import { buildQrPreviewUrl, buildRedirectUrl, downloadQrSvg } from "../../lib/qr";
import type { CreateShirtPayload, ProductionStatus, SalesChannel, Shirt } from "../../lib/types";

type CreateShirtFormProps = {
  onSubmit: (payload: CreateShirtPayload) => Promise<Shirt>;
  isBusy: boolean;
};

const salesChannelOptions: { value: SalesChannel; label: string }[] = [
  { value: "shopify", label: "Shopify" },
  { value: "printify_sample", label: "Printify sample" },
  { value: "manual", label: "Manuale" }
];

const productionStatusOptions: { value: ProductionStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "qr_ready", label: "QR pronto" },
  { value: "sent_to_printify", label: "Inviato a Printify" },
  { value: "in_production", label: "In produzione" },
  { value: "shipped", label: "Spedito" },
  { value: "active", label: "Attivo" }
];

export function CreateShirtForm({ onSubmit, isBusy }: CreateShirtFormProps) {
  const [form, setForm] = useState<CreateShirtPayload>({
    label: "ScanMe Launch Tee",
    targetUrl: "https://example.com/my-profile",
    commerce: {
      salesChannel: "shopify",
      orderReference: "SHOPIFY-1002",
      customerName: "Vincenzo Baldoni",
      customerEmail: "official.scanme.app@gmail.com",
      requestedUrl: "https://example.com/my-profile"
    },
    product: {
      model: "Unisex Heavy Cotton Tee",
      size: "L",
      color: "Black",
      placement: "Back upper center",
      printProvider: "Printify"
    },
    operations: {
      productionStatus: "draft",
      notes: "Primo digital twin creato dal portale interno."
    }
  });
  const [createdItem, setCreatedItem] = useState<Shirt | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const item = await onSubmit(form);
      setCreatedItem(item);
      setMessage("Digital twin creato con successo. Il QR e' pronto da scaricare.");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Creazione non riuscita."
      );
    }
  };

  return (
    <Card
      title="Nuovo Digital Twin"
      subtitle="Backoffice interno per creare l'identita' digitale di ogni capo"
    >
      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-section">
          <div>
            <p className="eyebrow">Capo</p>
            <h3>Identita' del prodotto</h3>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Nome interno del capo</span>
              <input
                value={form.label}
                onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
              />
            </label>
            <label className="field">
              <span>Link target iniziale</span>
              <input
                value={form.targetUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, targetUrl: event.target.value }))
                }
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <div>
            <p className="eyebrow">Ordine</p>
            <h3>Dati commerciale e cliente</h3>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Canale vendita</span>
              <select
                value={form.commerce.salesChannel}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    commerce: {
                      ...current.commerce,
                      salesChannel: event.target.value as SalesChannel
                    }
                  }))
                }
              >
                {salesChannelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Order reference</span>
              <input
                value={form.commerce.orderReference}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    commerce: { ...current.commerce, orderReference: event.target.value }
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Cliente</span>
              <input
                value={form.commerce.customerName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    commerce: { ...current.commerce, customerName: event.target.value }
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Email cliente</span>
              <input
                value={form.commerce.customerEmail}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    commerce: { ...current.commerce, customerEmail: event.target.value }
                  }))
                }
              />
            </label>
            <label className="field field--full">
              <span>URL richiesto in checkout</span>
              <input
                value={form.commerce.requestedUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    commerce: { ...current.commerce, requestedUrl: event.target.value }
                  }))
                }
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <div>
            <p className="eyebrow">Produzione</p>
            <h3>Specifiche Printify</h3>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Modello</span>
              <input
                value={form.product.model}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    product: { ...current.product, model: event.target.value }
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Taglia</span>
              <input
                value={form.product.size}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    product: { ...current.product, size: event.target.value }
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Colore</span>
              <input
                value={form.product.color}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    product: { ...current.product, color: event.target.value }
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Posizionamento stampa</span>
              <input
                value={form.product.placement}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    product: { ...current.product, placement: event.target.value }
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Print provider</span>
              <input
                value={form.product.printProvider}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    product: { ...current.product, printProvider: event.target.value }
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Stato produzione</span>
              <select
                value={form.operations.productionStatus}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    operations: {
                      ...current.operations,
                      productionStatus: event.target.value as ProductionStatus
                    }
                  }))
                }
              >
                {productionStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field field--full">
              <span>Note operative</span>
              <textarea
                rows={4}
                value={form.operations.notes ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    operations: { ...current.operations, notes: event.target.value }
                  }))
                }
              />
            </label>
          </div>
        </div>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" disabled={isBusy} type="submit">
          {isBusy ? "Creazione..." : "Crea digital twin"}
        </button>
        {createdItem ? (
          <CreatedTwinOutput item={createdItem} />
        ) : null}
      </form>
    </Card>
  );
}

function CreatedTwinOutput({ item }: { item: Shirt }) {
  const redirectUrl = buildRedirectUrl(config.redirectBaseUrl || window.location.origin, item.shirtId);
  const qrPreviewUrl = buildQrPreviewUrl(config.qrPreviewBaseUrl, redirectUrl);

  return (
    <div className="created-output">
      <div>
        <p className="eyebrow">Output creazione</p>
        <h3>QR pronto per la stampa</h3>
      </div>
      <div className="created-output__layout">
        <img alt={`QR ${item.label}`} className="created-output__qr" src={qrPreviewUrl} />
        <div className="stack">
          <div className="info-panel">
            <p className="eyebrow">Redirect stabile</p>
            <a className="inline-link" href={redirectUrl} rel="noreferrer" target="_blank">
              {redirectUrl}
            </a>
          </div>
          <div className="action-row">
            <button
              className="primary-button"
              onClick={() => downloadQrSvg(redirectUrl, `${item.shirtId}.svg`)}
              type="button"
            >
              Scarica QR SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
