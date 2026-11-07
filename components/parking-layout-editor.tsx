"use client"

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { ParkingLayout } from "./parking-layout";
import type { ParkingLevel } from "./parking-layout";
import {
  MAX_SIZE,
  MIN_SIZE,
  analyze,
  cellKey,
  computeLabels,
  init,
  isBlocking,
  lineKeys,
  rectKeys,
  reducer,
  toParkingLevel,
} from "./layout-model";
import type { EditorLevel, Tool } from "./layout-model";
// import "./ParkingLayoutEditor.css";

export interface ParkingLayoutEditorProps {
  /** Start from an existing layout. Omit to start with a small template. */
  initialLevels?: ParkingLevel[];
  /** Called after every change with the layout in the driver view's format. */
  onChange?: (levels: ParkingLevel[]) => void;
  onSave?: (levels: ParkingLevel[]) => void;
  saveLabel?: string;
}

const TOOLS: { id: Tool; label: string; hint: string }[] = [
  { id: "bay", label: "Standard bay", hint: "A regular parking space" },
  { id: "ev", label: "EV bay", hint: "A space with a charger" },
  { id: "accessible", label: "Accessible bay", hint: "A wider space close to the entrance" },
  { id: "lane", label: "Drive lane", hint: "Where cars drive" },
  { id: "entrance", label: "Entrance", hint: "Lift, stairs or ramp. One per level" },
  { id: "erase", label: "Eraser", hint: "Clears cells" },
];

const KIND_MARK = { standard: "", ev: "EV", accessible: "♿" } as const;

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

const plural = (n: number, word: string): string => `${n} ${word}${n === 1 ? "" : "s"}`;

export function ParkingLayoutEditor({
  initialLevels,
  onChange,
  onSave,
  saveLabel = "Save layout",
}: ParkingLayoutEditorProps) {
  const [state, dispatch] = useReducer(reducer, initialLevels, init);
  const [tool, setTool] = useState<Tool>("bay");
  const [shape, setShape] = useState<"brush" | "rect">("brush");
  const [preview, setPreview] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const [focusCell, setFocusCell] = useState({ r: 0, c: 0 });

  const gridRef = useRef<HTMLDivElement>(null);
  const stroke = useRef<{ start: [number, number]; last: [number, number]; keys: string[] } | null>(null);

  const level = state.levels.find((l) => l.id === state.activeId) ?? (state.levels[0] as EditorLevel);

  const labels = useMemo(() => computeLabels(level), [level]);
  const analyses = useMemo(() => state.levels.map((l) => ({ level: l, issues: analyze(l) })), [state.levels]);
  const activeIssues = analyses.find((a) => a.level.id === level.id)?.issues;
  const blocking = analyses.some((a) => isBlocking(a.issues));
  const parkingLevels = useMemo(() => state.levels.map(toParkingLevel), [state.levels]);

  const issueKeys = useMemo(
    () => new Set([...(activeIssues?.unreachableBays ?? []), ...(activeIssues?.orphanLanes ?? [])]),
    [activeIssues]
  );
  const draftSet = useMemo(() => new Set(draft), [draft]);

  const counts = useMemo(() => {
    const cells = Object.values(level.cells);
    return {
      bays: cells.filter((c) => c.type === "bay").length,
      lanes: cells.filter((c) => c.type === "lane").length,
    };
  }, [level]);

  /* Report changes to the parent without re-running when its callback identity changes. */
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    onChangeRef.current?.(parkingLevels);
  }, [parkingLevels]);

  /* ---------- Pointer painting ---------- */

  const cellAt = (x: number, y: number): [number, number] | null => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-r]");
    if (!el || !gridRef.current?.contains(el)) return null;
    return [Number(el.dataset.r), Number(el.dataset.c)];
  };

  const extend = (cell: [number, number]) => {
    const s = stroke.current;
    if (!s) return;
    if (shape === "rect") {
      s.keys = rectKeys(s.start, cell);
    } else {
      const added = lineKeys(s.last, cell);
      s.keys = [...s.keys, ...added.filter((k) => !s.keys.includes(k))];
    }
    s.last = cell;
    setDraft(s.keys);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    stroke.current = { start: cell, last: cell, keys: [cellKey(cell[0], cell[1])] };
    setDraft(stroke.current.keys);
    setFocusCell({ r: cell[0], c: cell[1] });
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!stroke.current) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (cell) extend(cell);
  };

  const endStroke = (commitStroke: boolean) => {
    const s = stroke.current;
    stroke.current = null;
    setDraft([]);
    if (commitStroke && s) dispatch({ type: "apply", keys: s.keys, tool });
  };

  /* ---------- Keyboard ---------- */

  const moveFocus = (r: number, c: number) => {
    const nr = clamp(r, 0, level.rows - 1);
    const nc = clamp(c, 0, level.cols - 1);
    setFocusCell({ r: nr, c: nc });
    gridRef.current?.querySelector<HTMLElement>(`[data-r="${nr}"][data-c="${nc}"]`)?.focus();
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.dataset.r === undefined) return;
    const r = Number(target.dataset.r);
    const c = Number(target.dataset.c);

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        moveFocus(r - 1, c);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(r + 1, c);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(r, c - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus(r, c + 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        dispatch({ type: "apply", keys: [cellKey(r, c)], tool });
        break;
      case "Delete":
      case "Backspace":
        e.preventDefault();
        dispatch({ type: "apply", keys: [cellKey(r, c)], tool: "erase" });
        break;
    }
  };

  const onRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (!(e.metaKey || e.ctrlKey)) return;
    const k = e.key.toLowerCase();
    if (k === "z") {
      e.preventDefault();
      dispatch({ type: e.shiftKey ? "redo" : "undo" });
    } else if (k === "y") {
      e.preventDefault();
      dispatch({ type: "redo" });
    }
  };

  /* ---------- Render helpers ---------- */

  const describe = (r: number, c: number): string => {
    const cell = level.cells[cellKey(r, c)];
    const where = `Row ${r + 1}, column ${c + 1}`;
    if (!cell) return `${where}, empty`;
    if (cell.type === "lane") return `${where}, drive lane`;
    if (cell.type === "entrance") return `${where}, ${level.entranceLabel.toLowerCase()} entrance`;
    const kind = cell.kind === "ev" ? "EV bay" : cell.kind === "accessible" ? "accessible bay" : "bay";
    return `${where}, ${kind} ${labels[cellKey(r, c)] ?? ""}`;
  };

  const focusR = Math.min(focusCell.r, level.rows - 1);
  const focusC = Math.min(focusCell.c, level.cols - 1);

  const messages: string[] = [];
  for (const { level: l, issues } of analyses) {
    if (issues.noEntrance) messages.push(`${l.name}: place an entrance so drivers have a starting point.`);
    if (issues.noBays) messages.push(`${l.name}: add at least one bay.`);
    if (issues.unreachableBays.length > 0)
      messages.push(
        `${l.name}: ${plural(issues.unreachableBays.length, "bay")} can't be reached. Connect each one to a drive lane that links to the entrance.`
      );
    if (issues.orphanLanes.length > 0)
      messages.push(`${l.name}: ${plural(issues.orphanLanes.length, "lane cell")} aren't connected to the entrance.`);
  }

  const setNumber = (value: string, apply: (n: number) => void) => {
    const n = Number(value);
    if (Number.isFinite(n) && value !== "") apply(Math.round(n));
  };

  return (
    <div className="ple" onKeyDown={onRootKeyDown}>
      <div className="ple-top">
        <div className="ple-group" role="group" aria-label="Levels">
          {state.levels.map((l) => (
            <button
              key={l.id}
              type="button"
              className="ple-chip"
              aria-pressed={l.id === level.id}
              onClick={() => dispatch({ type: "select", id: l.id })}
            >
              {l.name || "Untitled level"}
            </button>
          ))}
        </div>
        <button type="button" className="ple-btn" onClick={() => dispatch({ type: "addLevel" })}>
          Add level
        </button>
        <button type="button" className="ple-btn" onClick={() => dispatch({ type: "duplicateLevel" })}>
          Duplicate
        </button>
        <button
          type="button"
          className="ple-btn"
          disabled={state.levels.length <= 1}
          onClick={() => dispatch({ type: "deleteLevel" })}
        >
          Delete level
        </button>

        <span className="ple-spacer" />

        <button type="button" className="ple-btn" disabled={state.past.length === 0} onClick={() => dispatch({ type: "undo" })}>
          Undo
        </button>
        <button type="button" className="ple-btn" disabled={state.future.length === 0} onClick={() => dispatch({ type: "redo" })}>
          Redo
        </button>
        <button type="button" className="ple-btn" aria-pressed={preview} onClick={() => setPreview((p) => !p)}>
          {preview ? "Back to editing" : "Preview as driver"}
        </button>
        <button
          type="button"
          className="ple-btn ple-btn--primary"
          disabled={blocking}
          onClick={() => onSave?.(parkingLevels)}
        >
          {saveLabel}
        </button>
      </div>

      {preview ? (
        <div className="ple-preview">
          <ParkingLayout key={level.id} levels={parkingLevels} initialLevelId={level.id} />
        </div>
      ) : (
        <div className="ple-body">
          <aside className="ple-side">
            <fieldset className="ple-fieldset">
              <legend>Draw with</legend>
              <div className="ple-tools">
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="ple-tool"
                    aria-pressed={tool === t.id}
                    onClick={() => setTool(t.id)}
                  >
                    <span className={`ple-sw ple-sw--${t.id}`} aria-hidden="true" />
                    <span>
                      <span className="ple-tool-name">{t.label}</span>
                      <span className="ple-tool-hint">{t.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="ple-fieldset">
              <legend>Drag to draw</legend>
              <div className="ple-group" role="group" aria-label="Drag shape">
                <button type="button" className="ple-chip" aria-pressed={shape === "brush"} onClick={() => setShape("brush")}>
                  Line
                </button>
                <button type="button" className="ple-chip" aria-pressed={shape === "rect"} onClick={() => setShape("rect")}>
                  Rectangle
                </button>
              </div>
            </fieldset>

            <fieldset className="ple-fieldset">
              <legend>This level</legend>
              <label className="ple-field">
                Name
                <input
                  type="text"
                  value={level.name}
                  onChange={(e) => dispatch({ type: "rename", name: e.target.value })}
                />
              </label>
              <div className="ple-row">
                <label className="ple-field">
                  Rows
                  <input
                    type="number"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    value={level.rows}
                    onChange={(e) => setNumber(e.target.value, (n) => dispatch({ type: "resize", rows: n, cols: level.cols }))}
                  />
                </label>
                <label className="ple-field">
                  Columns
                  <input
                    type="number"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    value={level.cols}
                    onChange={(e) => setNumber(e.target.value, (n) => dispatch({ type: "resize", rows: level.rows, cols: n }))}
                  />
                </label>
              </div>
              <label className="ple-field">
                Entrance name
                <input
                  type="text"
                  value={level.entranceLabel}
                  maxLength={8}
                  onChange={(e) => dispatch({ type: "entranceLabel", label: e.target.value })}
                />
              </label>
              <button type="button" className="ple-btn" onClick={() => dispatch({ type: "clearLevel" })}>
                Clear level
              </button>
            </fieldset>
          </aside>

          <div className="ple-main">
            <div className="ple-scroll">
              <div
                ref={gridRef}
                className="ple-grid"
                role="group"
                aria-label={`${level.name} layout editor. Arrow keys move, Enter places the selected item, Delete clears.`}
                style={{ gridTemplateColumns: `repeat(${level.cols}, var(--ple-cell))` }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={() => endStroke(true)}
                onPointerCancel={() => endStroke(false)}
                onKeyDown={onGridKeyDown}
              >
                {Array.from({ length: level.rows }, (_, r) =>
                  Array.from({ length: level.cols }, (_, c) => {
                    const k = cellKey(r, c);
                    const cell = level.cells[k];
                    const type = cell?.type ?? "empty";
                    const hasIssue = issueKeys.has(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        data-r={r}
                        data-c={c}
                        data-kind={cell?.kind}
                        className={[
                          "ple-cell",
                          `ple-cell--${type}`,
                          draftSet.has(k) ? "is-draft" : "",
                          hasIssue ? "has-issue" : "",
                        ].join(" ")}
                        tabIndex={r === focusR && c === focusC ? 0 : -1}
                        aria-label={describe(r, c) + (hasIssue ? ", not connected to the entrance" : "")}
                        onFocus={() => setFocusCell({ r, c })}
                      >
                        {cell?.type === "bay" && (
                          <>
                            <span className="ple-label">{labels[k]}</span>
                            <span className="ple-mark" aria-hidden="true">
                              {hasIssue ? "!" : KIND_MARK[cell.kind]}
                            </span>
                          </>
                        )}
                        {cell?.type === "entrance" && <span className="ple-chip-label">{level.entranceLabel}</span>}
                        {cell?.type === "lane" && hasIssue && (
                          <span className="ple-mark" aria-hidden="true">
                            !
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <p className="ple-counts">
              {plural(counts.bays, "bay")} and {plural(counts.lanes, "lane cell")} on this level. Cells marked ! aren't
              connected to the entrance.
            </p>

            {messages.length > 0 ? (
              <ul className="ple-issues" aria-label="Things to fix">
                {messages.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : (
              <p className="ple-ok">Every bay can be reached from the entrance.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ParkingLayoutEditor;