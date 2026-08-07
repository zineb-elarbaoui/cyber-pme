import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { domains } from "@/lib/mock-data";

const data = domains.map((d) => ({ domain: d.name.split(" ").slice(0, 2).join(" "), score: d.score, full: d.max }));

export function DomainRadar() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="oklch(0.88 0.02 250)" />
          <PolarAngleAxis dataKey="domain" tick={{ fill: "oklch(0.35 0.05 258)", fontSize: 10.5 }} />
          <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "oklch(0.6 0.03 258)", fontSize: 9 }} axisLine={false} />
          <Radar dataKey="score" stroke="oklch(0.55 0.16 255)" fill="oklch(0.55 0.16 255)" fillOpacity={0.28} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DomainBars() {
  return (
    <div className="space-y-2.5">
      {domains.map((d) => {
        const pct = (d.score / d.max) * 100;
        const tone =
          d.score <= 1 ? "oklch(0.58 0.22 25)" :
          d.score <= 2 ? "oklch(0.72 0.16 60)" :
          d.score <= 3 ? "oklch(0.55 0.16 255)" :
          "oklch(0.62 0.16 155)";
        return (
          <div key={d.id} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{d.name}</span>
                <span className="tabular-nums text-muted-foreground">{d.score}/{d.max}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tone }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}