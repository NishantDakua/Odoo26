"use client";

type Segment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  segments: Segment[];
  total: number;
  centerLabel?: string;
  thickness?: number;
};

const VB = 200;
const CX = VB / 2;
const CY = VB / 2;

export function DonutChart({ segments, total, centerLabel, thickness = 32 }: DonutChartProps) {
  const r = (VB - thickness) / 2;
  const circ = 2 * Math.PI * r;

  let accumulated = 0;
  const arcs = segments.map((seg) => {
    const dash = total > 0 ? (seg.value / total) * circ : 0;
    const offset = circ - accumulated;
    accumulated += dash;
    return { ...seg, dash, offset };
  });

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full max-w-[180px]">
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="w-full h-auto"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={CX} cy={CY} r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={thickness}
            className="dark:stroke-gray-700"
          />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={CX} cy={CY} r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeDasharray={`${arc.dash} ${circ - arc.dash}`}
              strokeDashoffset={arc.offset}
              strokeLinecap="butt"
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none px-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none">
            {total}
          </span>
          {centerLabel && (
            <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-tight">
              {centerLabel}
            </span>
          )}
        </div>
      </div>

      <div className="w-full space-y-1.5 px-1">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <div key={seg.label} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="flex-1 text-gray-700 dark:text-gray-300 text-xs">
                {seg.label}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs tabular-nums whitespace-nowrap">
                {seg.value} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
