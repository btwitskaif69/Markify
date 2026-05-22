import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
const ENV = globalForPrisma.process?.env || {};

const DEFAULT_CONNECT_TIMEOUT_SECONDS = "10";
const DEFAULT_POOL_TIMEOUT_SECONDS = "10";
const DEFAULT_CONNECTION_LIMIT = "3";

const normalizeDatabaseUrl = (value) => {
  if (!value) return value;

  try {
    const url = new URL(value);

    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", DEFAULT_CONNECT_TIMEOUT_SECONDS);
    }

    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", DEFAULT_POOL_TIMEOUT_SECONDS);
    }

    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", DEFAULT_CONNECTION_LIMIT);
    }

    return url.toString();
  } catch {
    return value;
  }
};

const runtimeDatabaseUrl = normalizeDatabaseUrl(ENV.DATABASE_URL);

const prismaOptions = {
  log: ENV.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
};

if (runtimeDatabaseUrl) {
  prismaOptions.datasources = {
    db: {
      url: runtimeDatabaseUrl,
    },
  };
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaOptions);

globalForPrisma.prisma = prisma;

export default prisma;
