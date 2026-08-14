import { maturityLabel } from "@/lib/maturity";

const HEX = {
  accent: "#2E6EE0",
  track: "#E9EDF5",
  critical: "#C0392B",
  warning: "#C77B1E",
  success: "#3D8A5C",
};

export function ScoreGauge({ score, maxScore, size = 220 }: { score: number; maxScore: number; size?: number }) {
  const pct = maxScore > 0 ? Math.min(1, score / maxScore) : 0;
  const stroke = 14;
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;
  const label = maturityLabel(score, maxScore);
  const toneColor =
    label.tone === "success" ? HEX.success :
    label.tone === "warning" ? HEX.warning :
    label.tone === "critical" ? HEX.critical :
    HEX.accent;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={HEX.accent} />
            <stop offset="100%" stopColor={toneColor} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} stroke={HEX.track} strokeWidth={stroke} fill="none" />
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
        <div className="text-xs text-muted-foreground">/ {maxScore}</div>
        <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: toneColor }}>
          {label.label}
        </div>
      </div>
    </div>
  );
}