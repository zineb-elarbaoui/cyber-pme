import { maturityLabel, maxGlobalScore } from "@/lib/mock-data";

export function ScoreGauge({ score, size = 220 }: { score: number; size?: number }) {
  const pct = Math.min(1, score / maxGlobalScore);
  const stroke = 14;
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;
  const label = maturityLabel(score);
  const toneColor =
    label.tone === "success" ? "oklch(0.62 0.16 155)" :
    label.tone === "warning" ? "oklch(0.72 0.16 60)" :
    label.tone === "critical" ? "oklch(0.58 0.22 25)" :
    "oklch(0.55 0.16 255)";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.16 255)" />
            <stop offset="100%" stopColor={toneColor} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} stroke="oklch(0.92 0.015 250)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke="url(#gaugeGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-5xl font-semibold tabular-nums tracking-tight">{score}</div>
        <div className="text-xs text-muted-foreground">/ {maxGlobalScore}</div>
        <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: toneColor }}>
          {label.label}
        </div>
      </div>
    </div>
  );
}