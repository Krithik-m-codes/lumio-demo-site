/**
 * Tiny localStorage "database".
 * Collections are stored as JSON arrays under `lumio_db_<collection>`.
 */

export interface DbRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 6);
}

function key(collection: string) {
  return `lumio_db_${collection}`;
}

function load<T extends DbRecord>(collection: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key(collection)) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function save<T extends DbRecord>(collection: string, items: T[]): void {
  localStorage.setItem(key(collection), JSON.stringify(items));
}

export const db = {
  list<T extends DbRecord>(collection: string): T[] {
    return load<T>(collection);
  },

  get<T extends DbRecord>(collection: string, id: string): T | undefined {
    return load<T>(collection).find((r) => r.id === id);
  },

  create<T extends DbRecord>(
    collection: string,
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): T {
    const items = load<T>(collection);
    const now = Date.now();
    const record = { ...data, id: uid(), createdAt: now, updatedAt: now } as unknown as T;
    items.push(record);
    save(collection, items);
    return record;
  },

  update<T extends DbRecord>(
    collection: string,
    id: string,
    patch: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
  ): T | undefined {
    const items = load<T>(collection);
    const idx = items.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...patch, updatedAt: Date.now() };
    save(collection, items);
    return items[idx];
  },

  remove(collection: string, id: string): boolean {
    const items = load<DbRecord>(collection);
    const next = items.filter((r) => r.id !== id);
    if (next.length === items.length) return false;
    save(collection, next);
    return true;
  },

  clear(collection: string): void {
    localStorage.removeItem(key(collection));
  },

  /** Seed data only if collection is empty */
  seed<T extends DbRecord>(collection: string, rows: Omit<T, "id" | "createdAt" | "updatedAt">[]): void {
    if (load(collection).length > 0) return;
    const now = Date.now();
    const records = rows.map((r, i) => ({
      ...r,
      id: uid(),
      createdAt: now - (rows.length - i) * 86_400_000,
      updatedAt: now - (rows.length - i) * 86_400_000,
    })) as unknown as T[];
    save(collection, records);
  },
};

/* ── Typed collections ──────────────────────────────────────────────── */

export interface AppEvent extends DbRecord {
  name: string;
  userId: string;
  properties: Record<string, string>;
  source: "manual" | "sdk" | "api";
}

export interface Metric extends DbRecord {
  name: string;
  description: string;
  eventName: string;
  aggregation: "count" | "unique_users" | "sum";
  propertyKey: string;
  period: "day" | "week" | "month";
  goal: number | null;
}

export interface TeamMember extends DbRecord {
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  status: "active" | "invited" | "suspended";
  avatar: string;
}

export interface Workspace extends DbRecord {
  name: string;
  plan: "starter" | "growth" | "enterprise";
  writeKey: string;
  timezone: string;
  eventsThisMonth: number;
  eventsLimit: number;
}

export const EVENTS = "events";
export const METRICS = "metrics";
export const TEAM = "team";
export const WORKSPACE = "workspace";
