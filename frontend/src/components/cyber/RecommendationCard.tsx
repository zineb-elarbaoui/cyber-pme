import { Link } from "@tanstack/react-router";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useState } from "react";
import { PriorityBadge, MetaBadge, DomainTag } from "./Badges";
import type { Recommendation } from "@/lib/mock-data";

export function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-gradient-card shadow-sm transition hover:shadow-elegant">
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:gap-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 font-display text-sm font-semibold text-primary tabular-nums ring-1 ring-primary/10">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={rec.priority} />
            <DomainTag>{rec.domainName}</DomainTag>
          </div>
          <h3 className="mt-2.5 font-display text-[17px] font-semibold leading-snug text-foreground">
            {rec.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{rec.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <MetaBadge label="Coût" value={rec.cost} />
            <MetaBadge label="Difficulté" value={rec.difficulty} />
            <MetaBadge label="Impact" value={rec.impact} />
            <MetaBadge label="Réf." value={rec.guideRef} />
          </div>
          {open && (
            <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-foreground/85">
              <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                Justification (RAG)
              </div>
              {rec.rationale}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
            >
              <ChevronDown className={"h-3.5 w-3.5 transition-transform " + (open ? "rotate-180" : "")} />
              {open ? "Masquer" : "Voir la justification"}
            </button>
            <Link
              to="/recommendation/$id"
              params={{ id: rec.id }}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-95"
            >
              Détail <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}