"use client"

import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { 
    AccessibilityIcon,
    EvChargerIcon,
    SquareLetterPIcon,
    type LucideIcon
} from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
// import "./ParkingLayout.css";

/* ---------- Types ---------- */

export type SpotKind = "standard" | "ev" | "accessible";
export type SpotStatus = "free" | "taken" | "held";

export interface ParkingSpot {
  id: string;
  label: string; // e.g. "B4"
  row: number; // 0-based grid row
  col: number; // 0-based grid column
  kind: SpotKind;
  status: SpotStatus;
}

export interface ParkingLevel {
  id: string;
  name: string; // e.g. "Level 2"
  rows: number; // total grid rows, including drive lanes
  cols: number;
  laneRows: number[]; // rows that are drive lanes (no spots)
  laneCells?: { row: number; col: number }[]; // individual lane cells, as drawn in the layout editor
  entrance: { row: number; col: number }; // lift, stairs or ramp used to measure "closest"
  entranceLabel?: string; // defaults to "Lift"
  spots: ParkingSpot[];
}

export interface ParkingLayoutProps {
  levels: ParkingLevel[];
  /** Controlled selection. Omit to let the component manage it. */
  selectedSpotId?: string | null;
  defaultSelectedSpotId?: string | null;
  initialLevelId?: string;
  onSelectSpot?: (spot: ParkingSpot | null, level: ParkingLevel | null) => void;
  onConfirm?: (spot: ParkingSpot, level: ParkingLevel) => void;
  confirmLabel?: string;
}

type KindFilter = "all" | SpotKind;

/* ---------- Helpers ---------- */

const KIND_LABEL: Record<SpotKind, string> = {
  standard: "Standard",
  ev: "EV charging",
  accessible: "Accessible",
};

const KIND_MARK: Record<SpotKind, string> = {
  standard: "",
  ev: "EV",
  accessible: "♿",
};

const FILTERS: { value: KindFilter; label: string; icon: LucideIcon}[] = [
  { value: "all", label: "All bays", icon: SquareLetterPIcon},
  { value: "ev", label: "EV charging", icon: EvChargerIcon },
  { value: "accessible", label: "Accessible", icon: AccessibilityIcon },
];

const ARROWS: Record<string, { dr: number; dc: number }> = {
  ArrowUp: { dr: -1, dc: 0 },
  ArrowDown: { dr: 1, dc: 0 },
  ArrowLeft: { dr: 0, dc: -1 },
  ArrowRight: { dr: 0, dc: 1 },
};

const distance = (
  a: { row: number; col: number },
  b: { row: number; col: number }
): number => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

const spotDescription = (spot: ParkingSpot): string =>
  `Spot ${spot.label}, ${KIND_LABEL[spot.kind]}, ${
    spot.status === "free" ? "free" : spot.status === "held" ? "held for another driver" : "taken"
  }`;

/* ---------- Component ---------- */

export function ParkingLayout({
  levels,
  selectedSpotId,
  defaultSelectedSpotId = null,
  initialLevelId,
  onSelectSpot,
  onConfirm,
  confirmLabel = "Reserve spot",
}: ParkingLayoutProps) {
  const [levelId, setLevelId] = useState<string | undefined>(initialLevelId ?? levels[0]?.id);
  const [filter, setFilter] = useState<KindFilter>("all");
  const [internalId, setInternalId] = useState<string | null>(defaultSelectedSpotId);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());

  const selectedId = selectedSpotId !== undefined ? selectedSpotId : internalId;
  const level = levels.find((l) => l.id === levelId) ?? levels[0];

  const selected = useMemo(() => {
    for (const l of levels) {
      const spot = l.spots.find((s) => s.id === selectedId);
      if (spot) return { spot, level: l };
    }
    return null;
  }, [levels, selectedId]);

  const byPos = useMemo(() => {
    const map = new Map<string, ParkingSpot>();
    level?.spots.forEach((s) => map.set(`${s.row},${s.col}`, s));
    return map;
  }, [level]);

  if (!level) {
    return <p className="pl-empty">No parking levels are available right now.</p>;
  }

  const matches = (s: ParkingSpot) => filter === "all" || s.kind === filter;
  const canSelect = (s: ParkingSpot) => s.status === "free" && matches(s);

  /* Roving tab stop: one tab stop for the whole plan, arrows move inside it. */
  const firstOpen = level.spots.find(canSelect) ?? level.spots[0];
  const tabStopId =
    (focusId && level.spots.some((s) => s.id === focusId) ? focusId : null) ??
    (selected?.level.id === level.id ? selected.spot.id : null) ??
    firstOpen?.id ??
    null;

  const select = (spot: ParkingSpot) => {
    if (!canSelect(spot)) return;
    const next = spot.id === selectedId ? null : spot;
    if (selectedSpotId === undefined) setInternalId(next ? next.id : null);
    onSelectSpot?.(next, next ? level : null);
    setNote(next ? `Spot ${spot.label} on ${level.name} selected.` : "Selection cleared.");
  };

  const selectClosest = () => {
    const best = level.spots
      .filter(canSelect)
      .sort((a, b) => distance(a, level.entrance) - distance(b, level.entrance))[0];
    if (!best) {
      setNote(`No free spots match this filter on ${level.name}. Try another level.`);
      return;
    }
    if (selectedSpotId === undefined) setInternalId(best.id);
    onSelectSpot?.(best, level);
    setFocusId(best.id);
    buttonRefs.current.get(best.id)?.focus();
    setNote(`Closest free spot is ${best.label} on ${level.name}.`);
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta: { dr: number; dc: number } | undefined = ARROWS[e.key];
    const id = (e.target as HTMLElement).dataset.spotId;
    if (!delta || !id) return;
    const from = level.spots.find((s) => s.id === id);
    if (!from) return;
    e.preventDefault();
    let { row, col } = from;
    for (;;) {
      row += delta.dr;
      col += delta.dc;
      if (row < 0 || col < 0 || row >= level.rows || col >= level.cols) return;
      const next = byPos.get(`${row},${col}`);
      if (next) {
        buttonRefs.current.get(next.id)?.focus();
        return;
      }
    }
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${level.cols}, var(--pl-bay-w))`,
    gridTemplateRows: Array.from({ length: level.rows }, (_, r) =>
      level.laneRows.includes(r) ? "var(--pl-lane-h)" : "var(--pl-bay-h)"
    ).join(" "),
  };

  return (
    <section className="pl" aria-label="Choose a parking spot">
      <div className="pl-toolbar">
        <div className="pl-group" role="group" aria-label="Level">
          {/* {levels.map((l) => {
            const free = l.spots.filter((s) => s.status === "free").length;
            return (
              <button
                key={l.id}
                type="button"
                className="pl-chip"
                aria-pressed={l.id === level.id}
                onClick={() => {
                  setLevelId(l.id);
                  setFocusId(null);
                }}
              >
                {l.name}
                <span className="pl-chip-count">{free} free</span>
              </button>
            );
          })} */}
          
          <ToggleGroup defaultValue={[level.id]} variant="outline" size="lg">
            {levels.map((l) => {
                const free = l.spots.filter((s) => s.status === "free").length;
                return (
                    <ToggleGroupItem 
                        value={l.id} 
                        disabled={level.id === l.id}
                        className="gap-2 text-white"
                        onClick={() => {
                            setLevelId(l.id);
                            setFocusId(null);
                        }}
                    >
                        {l.name}
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                            {free} free
                        </span>
                    </ToggleGroupItem>
                )
            })}
            </ToggleGroup>
        </div>

        <div className="pl-group" role="group" aria-label="Bay type">
            {/* {FILTERS.map((f) => {
                return (
                    <button
                    key={f.value}
                    type="button"
                    className="pl-chip"
                    aria-pressed={filter === f.value}
                    onClick={() => setFilter(f.value)}
                    >
                    {f.label}
                    </button>
                )
            })} */}
            <ToggleGroup defaultValue={[filter]} variant="outline">
                {FILTERS.map((f) => {
                    const { value, label, icon: Icon } = f
                    return (
                        <ToggleGroupItem 
                            value={value} 
                            disabled={filter === value}
                            aria-label={label}
                            onClick={() => setFilter(value)}
                            className="text-white"
                        >
                            <Icon />
                            {label}
                        </ToggleGroupItem>
                    )
                })}
            </ToggleGroup>
        </div>

        <button type="button" className="pl-closest" onClick={selectClosest}>
          Closest free to {level.entranceLabel ?? "Entry"}
        </button>
      </div>

      <div className="pl-scroll">
        <div
          className="pl-plan"
          style={gridStyle}
          role="group"
          aria-label={`${level.name} parking plan`}
          onKeyDown={onGridKeyDown}
        >
          {level.laneRows.map((r) => (
            <div key={`lane-${r}`} className="pl-lane" style={{ gridRow: r + 1 }} aria-hidden="true" />
          ))}

          {(level.laneCells ?? []).map(({ row, col }) => (
            <div
              key={`lane-${row}-${col}`}
              className="pl-lane"
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
              aria-hidden="true"
            />
          ))}
 
          <div
            className="pl-entrance"
            style={{ gridRow: level.entrance.row + 1, gridColumn: level.entrance.col + 1 }}
          >
            {level.entranceLabel ?? "Lift"}
          </div>
 
          {level.spots.map((spot) => {
            const isSelected = spot.id === selectedId;
            const open = canSelect(spot);
            const dimmed = !matches(spot);
            return (
              <button
                key={spot.id}
                type="button"
                ref={(el) => {
                  if (el) buttonRefs.current.set(spot.id, el);
                  else buttonRefs.current.delete(spot.id);
                }}
                data-spot-id={spot.id}
                data-kind={spot.kind}
                className={[
                  "pl-bay",
                  `pl-bay--${spot.status}`,
                  isSelected ? "is-selected" : "",
                  dimmed ? "is-dimmed" : "",
                ].join(" ")}
                style={{ gridRow: spot.row + 1, gridColumn: spot.col + 1 }}
                tabIndex={spot.id === tabStopId ? 0 : -1}
                aria-pressed={isSelected}
                aria-disabled={!open && !isSelected}
                aria-label={spotDescription(spot)}
                onFocus={() => setFocusId(spot.id)}
                onClick={() => select(spot)}
              >
                <span className="pl-bay-label">{spot.label}</span>
                <span className="pl-bay-mark" aria-hidden="true">
                  {isSelected ? "✓" : spot.status === "held" ? "Held" : KIND_MARK[spot.kind]}
                </span>
                {spot.status === "taken" && <span className="pl-car" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
 
      <ul className="pl-legend" aria-label="Legend">
        <li><span className="pl-swatch pl-swatch--free" />Free</li>
        <li><span className="pl-swatch pl-swatch--taken" />Taken</li>
        <li><span className="pl-swatch pl-swatch--held" />Held</li>
        <li><span className="pl-swatch pl-swatch--sel" />Your pick</li>
      </ul>
 
      <div className="pl-summary">
        {selected ? (
          <>
            <p className="pl-summary-text">
              <strong>Spot {selected.spot.label}</strong> on {selected.level.name},{" "}
              {KIND_LABEL[selected.spot.kind].toLowerCase()},{" "}
              {distance(selected.spot, selected.level.entrance)} bays from the{" "}
              {(selected.level.entranceLabel ?? "Lift").toLowerCase()}
            </p>
            <button
              type="button"
              className="pl-confirm"
              onClick={() => onConfirm?.(selected.spot, selected.level)}
            >
              {confirmLabel}
            </button>
          </>
        ) : (
          <p className="pl-summary-text">Pick a free bay on the plan, or use Closest free.</p>
        )}
      </div>
 
      <p className="pl-sr" role="status" aria-live="polite">
        {note}
      </p>
    </section>
  );
}

export default ParkingLayout;