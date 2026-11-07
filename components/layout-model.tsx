import type { ParkingLevel, ParkingSpot, SpotKind } from "./parking-layout";

/* ---------- Types ---------- */

export type CellType = "bay" | "lane" | "entrance";
export type Tool = "bay" | "ev" | "accessible" | "lane" | "entrance" | "erase";

export interface EditorCell {
  type: CellType;
  kind: SpotKind; // only meaningful for bays
}

export interface EditorLevel {
  id: string;
  name: string;
  rows: number;
  cols: number;
  entranceLabel: string;
  cells: Record<string, EditorCell>; // sparse: missing key = empty
}

export interface EditorState {
  levels: EditorLevel[];
  activeId: string;
  past: EditorLevel[][];
  future: EditorLevel[][];
}

export type Action =
  | { type: "apply"; keys: string[]; tool: Tool }
  | { type: "resize"; rows: number; cols: number }
  | { type: "rename"; name: string }
  | { type: "entranceLabel"; label: string }
  | { type: "clearLevel" }
  | { type: "addLevel" }
  | { type: "duplicateLevel" }
  | { type: "deleteLevel" }
  | { type: "select"; id: string }
  | { type: "undo" }
  | { type: "redo" };

export const MIN_SIZE = 2;
export const MAX_SIZE = 30;
const HISTORY_LIMIT = 100;

/* ---------- Small helpers ---------- */

export const cellKey = (r: number, c: number): string => `${r},${c}`;

export const parseKey = (k: string): [number, number] => {
  const [r = "0", c = "0"] = k.split(",");
  return [Number(r), Number(c)];
};

let counter = 0;
export const uid = (): string => `lvl-${Date.now().toString(36)}-${(counter++).toString(36)}`;

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/** Every cell in the rectangle between two corners. */
export function rectKeys(a: [number, number], b: [number, number]): string[] {
  const out: string[] = [];
  for (let r = Math.min(a[0], b[0]); r <= Math.max(a[0], b[0]); r++) {
    for (let c = Math.min(a[1], b[1]); c <= Math.max(a[1], b[1]); c++) out.push(cellKey(r, c));
  }
  return out;
}

/** A 4-connected line between two cells, so fast drags never leave gaps in a lane. */
export function lineKeys(a: [number, number], b: [number, number]): string[] {
  const out: string[] = [];
  let [r, c] = a;
  const [r1, c1] = b;
  const dr = Math.abs(r1 - r);
  const dc = Math.abs(c1 - c);
  const sr = r < r1 ? 1 : -1;
  const sc = c < c1 ? 1 : -1;
  let err = dc - dr;
  for (;;) {
    out.push(cellKey(r, c));
    if (r === r1 && c === c1) break;
    const e2 = 2 * err;
    const stepC = e2 > -dr;
    const stepR = e2 < dc;
    if (stepC) {
      err -= dr;
      c += sc;
    }
    if (stepC && stepR) out.push(cellKey(r, c));
    if (stepR) {
      err += dc;
      r += sr;
    }
  }
  return out;
}

/* ---------- Level operations ---------- */

/** A small starting layout: two bay rows, a lane, two more bay rows. */
export function starterLevel(id: string, name: string): EditorLevel {
  const cells: Record<string, EditorCell> = {};
  const cols = 8;
  for (let c = 0; c < cols; c++) {
    for (const r of [0, 1, 3, 4]) cells[cellKey(r, c)] = { type: "bay", kind: "standard" };
    cells[cellKey(2, c)] = { type: "lane", kind: "standard" };
  }
  cells[cellKey(2, 0)] = { type: "entrance", kind: "standard" };
  return { id, name, rows: 5, cols, entranceLabel: "Lift", cells };
}

export function applyTool(level: EditorLevel, keys: string[], tool: Tool): EditorLevel {
  const valid = keys.filter((k) => {
    const [r, c] = parseKey(k);
    return r >= 0 && c >= 0 && r < level.rows && c < level.cols;
  });
  if (valid.length === 0) return level;

  const cells = { ...level.cells };

  if (tool === "entrance") {
    const target = valid[valid.length - 1];
    if (target === undefined) return level;
    for (const k of Object.keys(cells)) {
      if (cells[k]?.type === "entrance") delete cells[k];
    }
    cells[target] = { type: "entrance", kind: "standard" };
    return { ...level, cells };
  }

  for (const k of valid) {
    if (tool === "erase") delete cells[k];
    else if (tool === "lane") cells[k] = { type: "lane", kind: "standard" };
    else cells[k] = { type: "bay", kind: tool === "bay" ? "standard" : tool };
  }
  return { ...level, cells };
}

export function resizeLevel(level: EditorLevel, rows: number, cols: number): EditorLevel {
  const cells: Record<string, EditorCell> = {};
  for (const [k, cell] of Object.entries(level.cells)) {
    const [r, c] = parseKey(k);
    if (r < rows && c < cols) cells[k] = cell;
  }
  return { ...level, rows, cols, cells };
}

/* ---------- Labels and validation ---------- */

const rowLetter = (i: number): string =>
  i < 26 ? String.fromCharCode(65 + i) : rowLetter(Math.floor(i / 26) - 1) + rowLetter(i % 26);

/** Auto labels: each row that has bays gets a letter, bays in it are numbered left to right. */
export function computeLabels(level: EditorLevel): Record<string, string> {
  const bays = Object.entries(level.cells)
    .filter(([, cell]) => cell.type === "bay")
    .map(([k]) => parseKey(k))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const labels: Record<string, string> = {};
  let letterIndex = -1;
  let lastRow = -1;
  let n = 0;
  for (const [r, c] of bays) {
    if (r !== lastRow) {
      letterIndex += 1;
      lastRow = r;
      n = 0;
    }
    n += 1;
    labels[cellKey(r, c)] = `${rowLetter(letterIndex)}${n}`;
  }
  return labels;
}

export interface LevelIssues {
  noEntrance: boolean;
  noBays: boolean;
  unreachableBays: string[];
  orphanLanes: string[];
}

const neighbours = (k: string): string[] => {
  const [r, c] = parseKey(k);
  return [cellKey(r - 1, c), cellKey(r + 1, c), cellKey(r, c - 1), cellKey(r, c + 1)];
};

/** Walks the drive lanes outward from the entrance, then checks every bay touches a reachable lane. */
export function analyze(level: EditorLevel): LevelIssues {
  const entries = Object.entries(level.cells);
  const entrance = entries.find(([, cell]) => cell.type === "entrance")?.[0];
  const reachable = new Set<string>();

  if (entrance) {
    reachable.add(entrance);
    const queue = [entrance];
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined) break;
      for (const n of neighbours(current)) {
        if (level.cells[n]?.type === "lane" && !reachable.has(n)) {
          reachable.add(n);
          queue.push(n);
        }
      }
    }
  }

  const bayKeys = entries.filter(([, cell]) => cell.type === "bay").map(([k]) => k);
  const laneKeys = entries.filter(([, cell]) => cell.type === "lane").map(([k]) => k);

  return {
    noEntrance: !entrance,
    noBays: bayKeys.length === 0,
    unreachableBays: entrance ? bayKeys.filter((k) => !neighbours(k).some((n) => reachable.has(n))) : [],
    orphanLanes: entrance ? laneKeys.filter((k) => !reachable.has(k)) : [],
  };
}

export const isBlocking = (i: LevelIssues): boolean => i.noEntrance || i.noBays;

/* ---------- Conversion to and from the driver view's data ---------- */

export function toParkingLevel(level: EditorLevel): ParkingLevel {
  const labels = computeLabels(level);
  const spots: ParkingSpot[] = [];
  const laneCells: { row: number; col: number }[] = [];
  let entrance = { row: 0, col: 0 };

  for (const [k, cell] of Object.entries(level.cells)) {
    const [row, col] = parseKey(k);
    if (cell.type === "bay") {
      const label = labels[k] ?? k;
      spots.push({ id: `${level.id}-${label}`, label, row, col, kind: cell.kind, status: "free" });
    } else {
      laneCells.push({ row, col }); // the entrance sits on a lane so the plan has no hole there
      if (cell.type === "entrance") entrance = { row, col };
    }
  }
  spots.sort((a, b) => a.row - b.row || a.col - b.col);

  return {
    id: level.id,
    name: level.name,
    rows: level.rows,
    cols: level.cols,
    laneRows: [],
    laneCells,
    entrance,
    entranceLabel: level.entranceLabel,
    spots,
  };
}

export function fromParkingLevel(level: ParkingLevel): EditorLevel {
  const cells: Record<string, EditorCell> = {};
  for (const r of level.laneRows) {
    for (let c = 0; c < level.cols; c++) cells[cellKey(r, c)] = { type: "lane", kind: "standard" };
  }
  for (const { row, col } of level.laneCells ?? []) cells[cellKey(row, col)] = { type: "lane", kind: "standard" };
  for (const s of level.spots) cells[cellKey(s.row, s.col)] = { type: "bay", kind: s.kind };
  cells[cellKey(level.entrance.row, level.entrance.col)] = { type: "entrance", kind: "standard" };
  return {
    id: level.id,
    name: level.name,
    rows: level.rows,
    cols: level.cols,
    entranceLabel: level.entranceLabel ?? "Lift",
    cells,
  };
}

/* ---------- Reducer with undo and redo ---------- */

export function init(initialLevels?: ParkingLevel[]): EditorState {
  const levels =
    initialLevels && initialLevels.length > 0
      ? initialLevels.map(fromParkingLevel)
      : [starterLevel(uid(), "Level 1")];
  const first = levels[0] as EditorLevel; // levels is never empty here
  return { levels, activeId: first.id, past: [], future: [] };
}

function commit(state: EditorState, levels: EditorLevel[], activeId: string = state.activeId): EditorState {
  return { levels, activeId, past: [...state.past, state.levels].slice(-HISTORY_LIMIT), future: [] };
}

const replaceLevel = (levels: EditorLevel[], next: EditorLevel): EditorLevel[] =>
  levels.map((l) => (l.id === next.id ? next : l));

export function reducer(state: EditorState, action: Action): EditorState {
  const active = state.levels.find((l) => l.id === state.activeId);

  switch (action.type) {
    case "apply": {
      if (!active) return state;
      const next = applyTool(active, action.keys, action.tool);
      return next === active ? state : commit(state, replaceLevel(state.levels, next));
    }
    case "resize": {
      if (!active) return state;
      const rows = clamp(action.rows, MIN_SIZE, MAX_SIZE);
      const cols = clamp(action.cols, MIN_SIZE, MAX_SIZE);
      if (rows === active.rows && cols === active.cols) return state;
      return commit(state, replaceLevel(state.levels, resizeLevel(active, rows, cols)));
    }
    case "rename":
      // Text edits skip the undo history so each keystroke isn't a step.
      return active ? { ...state, levels: replaceLevel(state.levels, { ...active, name: action.name }) } : state;
    case "entranceLabel":
      return active
        ? { ...state, levels: replaceLevel(state.levels, { ...active, entranceLabel: action.label }) }
        : state;
    case "clearLevel":
      return active ? commit(state, replaceLevel(state.levels, { ...active, cells: {} })) : state;
    case "addLevel": {
      const level = starterLevel(uid(), `Level ${state.levels.length + 1}`);
      return commit(state, [...state.levels, level], level.id);
    }
    case "duplicateLevel": {
      if (!active) return state;
      const copy: EditorLevel = { ...active, id: uid(), name: `${active.name} copy` };
      const index = state.levels.findIndex((l) => l.id === active.id);
      const levels = [...state.levels.slice(0, index + 1), copy, ...state.levels.slice(index + 1)];
      return commit(state, levels, copy.id);
    }
    case "deleteLevel": {
      if (!active || state.levels.length <= 1) return state;
      const index = state.levels.findIndex((l) => l.id === active.id);
      const levels = state.levels.filter((l) => l.id !== active.id);
      const nextActive = levels[Math.max(0, index - 1)];
      return commit(state, levels, nextActive ? nextActive.id : state.activeId);
    }
    case "select":
      return state.levels.some((l) => l.id === action.id) ? { ...state, activeId: action.id } : state;
    case "undo": {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      const stillThere = previous.some((l) => l.id === state.activeId);
      return {
        levels: previous,
        activeId: stillThere ? state.activeId : (previous[0]?.id ?? state.activeId),
        past: state.past.slice(0, -1),
        future: [state.levels, ...state.future],
      };
    }
    case "redo": {
      const [next, ...rest] = state.future;
      if (!next) return state;
      const stillThere = next.some((l) => l.id === state.activeId);
      return {
        levels: next,
        activeId: stillThere ? state.activeId : (next[0]?.id ?? state.activeId),
        past: [...state.past, state.levels],
        future: rest,
      };
    }
    default:
      return state;
  }
}