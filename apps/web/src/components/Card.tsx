import type { PropsWithChildren, ReactNode } from "react";

type CardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  action?: ReactNode;
}>;

export function Card({ title, subtitle, action, children }: CardProps) {
  return (
    <section className="card">
      <header className="card__header">
        <div>
          <p className="eyebrow">{title}</p>
          {subtitle ? <h2>{subtitle}</h2> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </header>
      <div className="card__content">{children}</div>
    </section>
  );
}
