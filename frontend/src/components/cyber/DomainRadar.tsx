// components/cyber/DomainRadar.tsx
// Radar dessiné en SVG pur, sans Recharts — Recharts (2.x et 3.x) a un bug
// documenté de compatibilité avec React 19 sur RadarChart spécifiquement
// (recharts/recharts#4558, #6857) : le polygone de données est calculé vide
// (d="") même avec des données correctes. Plutôt que de dépendre d'une
// version corrigée incertaine, ce composant recalcule la trigonométrie
// lui-même — aucune dépendance externe, donc aucun risque de régression.

export type DomainScore = { id: string | number; name: string; score: number; max: number };

const HEX = {
  accent: "#2E6EE0",
  gridLine: "#DDE3F0",
  axisLabel: "#2B3550",
  critical: "#C0392B",
  warning: "#C77B1E",
  success: "#3D8A5C",
};

const SCALE_MAX = 5; // échelle d'affichage commune (le domaine 3 plafonne à 4, cf. anomalie documentée)

function polarPoint(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

export function DomainRadar({ domains }: { domains: DomainScore[] }) {
  const n = domains.length;
  if (n === 0) return null;

  const size = 480;
  const cx = size / 2;
  const cy = size / 2 - 6;
  const outerRadius = 150;
  const step = 360 / n;

  const ringLevels = [1, 2, 3, 4, 5];
  const ringPolygons = ringLevels.map((level) => {
    const r = (level / SCALE_MAX) * outerRadius;
    const pts = domains.map((_, i) => polarPoint(cx, cy, r, i * step));
    return { level, points: pts.map((p) => `${p.x},${p.y}`).join(" ") };
  });

  const spokes = domains.map((_, i) => polarPoint(cx, cy, outerRadius, i * step));

  const dataPoints = domains.map((d, i) => {
    const r = (Math.min(d.score, SCALE_MAX) / SCALE_MAX) * outerRadius;
    return polarPoint(cx, cy, r, i * step);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const labels = domains.map((d, i) => {
    const p = polarPoint(cx, cy, outerRadius + 22, i * step);
    const shortName = d.name.split(" ").slice(0, 2).join(" ");
    // Ancrage du texte selon la position autour du cercle, pour éviter que
    // les labels débordent du bon côté (gauche/droite/centre).
    const angle = i * step;
    const anchor = angle > 10 && angle < 170 ? "start" : angle > 190 && angle < 350 ? "end" : "middle";
    return { x: p.x, y: p.y, text: shortName, anchor };
  });

  return (
    <div className="flex w-full justify-center overflow-x-auto">
      <svg width={size} height={size - 10} viewBox={`0 0 ${size} ${size - 10}`}>
        {/* Grille concentrique */}
        {ringPolygons.map((ring) => (
          <polygon key={ring.level} points={ring.points} fill="none" stroke={HEX.gridLine} strokeWidth={1} />
        ))}
        {/* Rayons */}
        {spokes.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={HEX.gridLine} strokeWidth={1} />
        ))}
        {/* Graduations 0/2/5 sur l'axe vertical */}
        {[0, 2, 5].map((v) => (
          <text key={v} x={cx + 4} y={cy - (v / SCALE_MAX) * outerRadius} fontSize={9} fill="#6B7280">{v}</text>
        ))}
        {/* Polygone de données */}
        <polygon points={dataPolygon} fill={HEX.accent} fillOpacity={0.3} stroke={HEX.accent} strokeWidth={2} />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={HEX.accent} />
        ))}
        {/* Labels des domaines */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            fontSize={10.5}
            fill={HEX.axisLabel}
            textAnchor={l.anchor as "start" | "end" | "middle"}
            dominantBaseline="middle"
          >
            {l.text}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function DomainBars({ domains }: { domains: DomainScore[] }) {
  return (
    <div className="space-y-2.5">
      {domains.map((d) => {
        const pct = d.max > 0 ? (d.score / d.max) * 100 : 0;
        const tone =
          d.score <= 1 ? HEX.critical :
          d.score <= 2 ? HEX.warning :
          d.score <= 3 ? HEX.accent :
          HEX.success;
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