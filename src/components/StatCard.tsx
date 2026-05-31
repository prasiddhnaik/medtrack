import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon?: ReactNode;
  tone?: "hero" | "default" | "danger";
};

export function StatCard({ label, value, detail, icon, tone = "default" }: StatCardProps) {
  if (tone === "hero") {
    return (
      <article className="rounded-lg border border-primary bg-primary p-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-semibold text-white/80">{label}</p>
          {icon ? <span className="text-white/90">{icon}</span> : null}
        </div>
        <p className="font-serif-display mt-5 text-5xl font-semibold leading-none">
          {value}
        </p>
        <p className="mt-3 text-[15px] text-white/80">{detail}</p>
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-border bg-surface p-5 text-text shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-text-muted">{label}</p>
        {icon ? (
          <span className={tone === "danger" ? "text-status-missed" : "text-primary"}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="font-serif-display mt-5 text-5xl font-semibold leading-none text-text">
        {value}
      </p>
      <p
        className={`mt-3 text-[15px] ${
          tone === "danger" ? "text-status-missed" : "text-primary"
        }`}
      >
        {detail}
      </p>
    </article>
  );
}
