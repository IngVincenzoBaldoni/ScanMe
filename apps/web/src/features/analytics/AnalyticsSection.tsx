import { Card } from "../../components/Card";
import type { Shirt } from "../../lib/types";

type AnalyticsSectionProps = {
  items: Shirt[];
};

const formatDate = (value?: string) => {
  if (!value) {
    return "mai";
  }

  return new Date(value).toLocaleString("it-IT");
};

export function AnalyticsSection({ items }: AnalyticsSectionProps) {
  const totalScans = items.reduce((sum, item) => sum + item.analytics.totalScans, 0);
  const activeTwins = items.filter((item) => item.operations.productionStatus === "active").length;
  const lastScanCandidates = items
    .map((item) => item.analytics.lastScannedAt)
    .filter(Boolean)
    .sort();
  const lastScannedAt = lastScanCandidates[lastScanCandidates.length - 1];

  return (
    <section className="analytics-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>Come stanno performando i tuoi QR</h2>
        </div>
      </div>

      <div className="analytics-summary-grid">
        <Card title="Totale scansioni" subtitle={String(totalScans)}>
          <p className="metric-caption">Somma di tutte le scansioni registrate sui tuoi capi.</p>
        </Card>
        <Card title="Capi monitorati" subtitle={String(items.length)}>
          <p className="metric-caption">
            Numero di digital twin attualmente tracciati nel portale interno.
          </p>
        </Card>
        <Card title="Twin attivi" subtitle={String(activeTwins)}>
          <p className="metric-caption">
            Capi gia' stampati o consegnati che stanno generando scansioni reali.
          </p>
        </Card>
        <Card title="Ultima scansione globale" subtitle={formatDate(lastScannedAt)}>
          <p className="metric-caption">Ultimo evento di redirect registrato dal backend.</p>
        </Card>
      </div>

      <div className="analytics-detail-grid">
        {items.map((item) => (
          <Card
            key={item.shirtId}
            title={item.label}
            subtitle={`${item.analytics.totalScans} scansioni • ${item.operations.productionStatus}`}
          >
            <div className="chart-row">
              {item.analytics.dailyScans.map((point) => (
                <div className="chart-bar-wrapper" key={point.date}>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${Math.max(18, point.count * 16)}px`
                    }}
                    title={`${point.date}: ${point.count}`}
                  />
                  <span>{point.date.slice(5)}</span>
                </div>
              ))}
            </div>
            <div className="analytics-footnote">
              <span>Ultima scansione: {formatDate(item.analytics.lastScannedAt)}</span>
              <span>ID capo: {item.shirtId}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
