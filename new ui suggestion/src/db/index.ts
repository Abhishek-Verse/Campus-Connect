import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function createPool() {
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: false,
  });
  // Idle client errors (server-side disconnects) must never crash the process.
  pool.on("error", (err) => {
    console.error("[db] idle client error:", err.message);
  });
  return pool;
}

// Transient network/DB hiccups must never take the whole server down
// (sandboxed infra recycles idle sockets; one request may 500, the next recovers).
const TRANSIENT =
  /ECONNRESET|ETIMEDOUT|EPIPE|EOF|ENETUNREACH|ECONNREFUSED|socket hang up|Connection (terminated|closed|ended|refused)|terminating connection/i;

if (typeof process !== "undefined") {
  process.on("uncaughtException", (err) => {
    if (TRANSIENT.test(err.message ?? "")) {
      console.error("[db] swallowed transient exception:", err.message);
      return;
    }
    throw err;
  });
  process.on("unhandledRejection", (reason) => {
    const msg = reason instanceof Error ? reason.message : String(reason);
    if (TRANSIENT.test(msg)) {
      console.error("[db] swallowed transient rejection:", msg);
      return;
    }
    throw reason;
  });
}

export const pool = globalForDb.__arenaNextJsPostgresqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool, { schema });
