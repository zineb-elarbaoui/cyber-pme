

export type MaturityTone = "critical" | "warning" | "primary" | "success";

export function maturityLabel(score: number, maxScore: number): { label: string; tone: MaturityTone } {
  const pct = maxScore > 0 ? score / maxScore : 0;
  if (pct < 0.25) return { label: "Maturité initiale", tone: "critical" };
  if (pct < 0.5) return { label: "Maturité émergente", tone: "warning" };
  if (pct < 0.75) return { label: "Maturité maîtrisée", tone: "primary" };
  return { label: "Maturité optimisée", tone: "success" };
}

export type PriorityBucket = "critical" | "high" | "medium" | "low";

export function priorityBucket(scorePriorite: number): PriorityBucket {
  if (scorePriorite >= 15) return "critical";
  if (scorePriorite >= 8) return "high";
  if (scorePriorite >= 4) return "medium";
  return "low";
}