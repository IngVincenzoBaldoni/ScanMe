import { Card } from "../../components/Card";

export function PublicPortal() {
  return (
    <main className="shell shell--public">
      <section className="hero">
        <p className="eyebrow">ScanMe</p>
        <h1>Il tuo capo fisico diventa un touchpoint digitale.</h1>
        <p className="lead">
          Ordini la maglietta sullo store, scegli il link da associare in fase di acquisto e noi
          ci occupiamo dietro le quinte di creare il QR dinamico e la sua identita' digitale.
        </p>
        <div className="hero__meta">
          <a className="ghost-link ghost-link--light" href="/internal">
            Accedi al portale interno
          </a>
        </div>
      </section>

      <section className="public-grid">
        <Card title="Per i clienti" subtitle="Cosa succede dopo l'acquisto">
          <div className="stack">
            <p className="metric-caption">
              Il cliente compra la maglietta, sceglie il link da associare e riceve il capo gia'
              pronto. Il QR stampato dietro la maglietta punta sempre a un redirect ScanMe, quindi
              il link puo' essere cambiato nel tempo senza ristampare nulla.
            </p>
          </div>
        </Card>
        <Card title="Per il brand" subtitle="Operazioni dietro le quinte">
          <div className="stack">
            <p className="metric-caption">
              Il founder usa il portale interno per creare il digital twin del capo, generare il
              QR stampabile, allineare Shopify e Printify e monitorare le analytics delle
              scansioni.
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
