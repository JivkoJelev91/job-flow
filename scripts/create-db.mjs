import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(root, ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set. Configure .env first.");
  process.exit(1);
}

const url = new URL(DATABASE_URL);
const dbName = decodeURIComponent(url.pathname.replace(/^\//, ""));
const host = url.hostname || "127.0.0.1";
const port = url.port || "5432";
const user = decodeURIComponent(url.username || "postgres");
const password = decodeURIComponent(url.password || "");

function findPsql() {
  if (process.env.PSQL_PATH) return process.env.PSQL_PATH;
  const candidates = [
    "C:/Program Files/PostgreSQL/18/bin/psql.exe",
    "C:/Program Files/PostgreSQL/17/bin/psql.exe",
    "C:/PostgreSQL/bin/psql.exe",
    "psql",
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) || candidate === "psql") return candidate;
  }
  return null;
}

const psql = findPsql();
if (!psql) {
  console.error("psql not found. Set PSQL_PATH or add psql to PATH.");
  process.exit(1);
}

const env = { ...process.env, PGPASSWORD: password };
const commonArgs = ["-U", user, "-h", host, "-p", port, "-w"];

const check = spawnSync(
  psql,
  [...commonArgs, "-d", "postgres", "-tAc", `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`],
  { env, encoding: "utf8" },
);

if (check.status !== 0) {
  console.error(check.stderr || `psql exited with code ${check.status}`);
  process.exit(check.status ?? 1);
}

if (check.stdout.trim() === "1") {
  console.log(`Database "${dbName}" already exists.`);
  process.exit(0);
}

const create = spawnSync(
  psql,
  [...commonArgs, "-d", "postgres", "-c", `CREATE DATABASE "${dbName}"`],
  { env, encoding: "utf8" },
);

if (create.status !== 0) {
  console.error(create.stderr || `psql exited with code ${create.status}`);
  process.exit(create.status ?? 1);
}

console.log(`Database "${dbName}" created.`);