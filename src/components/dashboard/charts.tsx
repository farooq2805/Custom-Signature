"use client";

/**
 * Hand-rolled SVG charts for the analytics dashboard.
 * Palette validated (dataviz six checks, light surface #ffffff):
 *   impressions #4f46e5 · clicks #0d9488 — CVD ΔE 76.6, all checks PASS.
 * Marks: 2px lines, ≥8px hover targets, recessive grid, direct labels,
 * text in ink tokens (never series color).
 */

import { useMemo, useState } from "react";

export const SERIES_COLORS = {
  impressions: "#4f46e5",
  clicks: "#0d9488",
} as const;

export interface DayPoint {
  date: string; // ISO day
  impressions: number;
  clicks: number;
}

export function StatTile({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-[--shadow-card]">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">{value}</p>
      {(delta || hint) && (
        <p className="mt-1.5 text-xs text-ink-faint">
          {delta && <span className="mr-1.5 font-semibold text-success">{delta}</span>}
          {hint}
        </p>
      )}
    </div>
  );
}

export function TrendChart({ data }: { data: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 720;
  const H = 240;
  const PAD = { top: 16, right: 16, bottom: 28, left: 40 };
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;

  const max = useMemo(
    () => Math.max(10, ...data.map((d) => Math.max(d.impressions, d.clicks))),
    [data]
  );

  const x = (i: number) => PAD.left + (i / Math.max(1, data.length - 1)) * iw;
  const y = (v: number) => PAD.top + ih - (v / max) * ih;

  const path = (key: "impressions" | "clicks") =>
    data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");

  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));

  const fmtDay = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-[--shadow-card]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display font-semibold text-ink">Impressions & clicks — last 14 days</p>
        <div className="flex gap-4 text-xs font-medium text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIES_COLORS.impressions }} />
            Impressions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIES_COLORS.clicks }} />
            Clicks
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[480px]"
          onMouseLeave={() => setHover(null)}
        >
          {/* recessive grid */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e7e7e2" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#8a8aa0">
                {t}
              </text>
            </g>
          ))}

          {/* x labels: first / middle / last */}
          {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#8a8aa0">
              {data[i] ? fmtDay(data[i].date) : ""}
            </text>
          ))}

          {/* series lines */}
          <path d={path("impressions")} fill="none" stroke={SERIES_COLORS.impressions} strokeWidth="2" strokeLinecap="round" />
          <path d={path("clicks")} fill="none" stroke={SERIES_COLORS.clicks} strokeWidth="2" strokeLinecap="round" />

          {/* direct labels at line ends */}
          {data.length > 1 && (
            <>
              <text x={x(data.length - 1) - 4} y={y(data[data.length - 1].impressions) - 8} textAnchor="end" fontSize="10" fontWeight="600" fill="#55556b">
                {data[data.length - 1].impressions}
              </text>
              <text x={x(data.length - 1) - 4} y={y(data[data.length - 1].clicks) - 8} textAnchor="end" fontSize="10" fontWeight="600" fill="#55556b">
                {data[data.length - 1].clicks}
              </text>
            </>
          )}

          {/* crosshair + markers on hover */}
          {hover !== null && data[hover] && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + ih} stroke="#55556b" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={x(hover)} cy={y(data[hover].impressions)} r="4" fill={SERIES_COLORS.impressions} stroke="#ffffff" strokeWidth="2" />
              <circle cx={x(hover)} cy={y(data[hover].clicks)} r="4" fill={SERIES_COLORS.clicks} stroke="#ffffff" strokeWidth="2" />
            </g>
          )}

          {/* wide invisible hit targets */}
          {data.map((_, i) => (
            <rect
              key={i}
              x={x(i) - iw / Math.max(1, data.length - 1) / 2}
              y={PAD.top}
              width={iw / Math.max(1, data.length - 1)}
              height={ih}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>

        {hover !== null && data[hover] && (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-[--shadow-pop]"
            style={{
              left: `calc(${((x(hover) / W) * 100).toFixed(1)}% ${x(hover) > W * 0.7 ? "- 130px" : "+ 10px"})`,
            }}
          >
            <p className="font-semibold text-ink">{fmtDay(data[hover].date)}</p>
            <p className="mt-1 flex items-center gap-1.5 text-ink-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: SERIES_COLORS.impressions }} />
              Impressions <strong className="text-ink">{data[hover].impressions}</strong>
            </p>
            <p className="flex items-center gap-1.5 text-ink-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: SERIES_COLORS.clicks }} />
              Clicks <strong className="text-ink">{data[hover].clicks}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Single-measure horizontal bars (one hue — magnitude of the same measure). */
export function BreakdownBars({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-[--shadow-card]">
      <p className="mb-4 font-display font-semibold text-ink">{title}</p>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label} className="group">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-muted">{r.label}</span>
              <span className="font-semibold text-ink">{r.value.toLocaleString()}</span>
            </div>
            <div className="h-2.5 rounded-full bg-cream-dim">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(r.value / max) * 100}%`, background: SERIES_COLORS.impressions }}
              />
            </div>
          </div>
        ))}
        {!rows.length && <p className="text-sm text-ink-faint">No data yet.</p>}
      </div>
    </div>
  );
}
