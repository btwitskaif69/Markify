const TRANSIENT_PRISMA_ERROR_CODES = new Set([
  "P1001", // Can't reach database server
  "P1002", // Database server reached but timed out
  "P1008", // Operations timed out
  "P1017", // Server has closed the connection
  "P2024", // Timed out fetching a connection from the pool
]);

const TRANSIENT_ERROR_PATTERNS = [
  /Can't reach database server/i,
  /timed out fetching a new connection/i,
  /server has closed the connection/i,
  /database server was reached but timed out/i,
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryablePrismaError = (error) => {
  if (!error) return false;

  if (TRANSIENT_PRISMA_ERROR_CODES.has(error.code)) {
    return true;
  }

  const message = String(error.message || "");
  return TRANSIENT_ERROR_PATTERNS.some((pattern) => pattern.test(message));
};

export const runWithPrismaRetry = async (
  operation,
  { label = "Prisma operation", retries = 2, delayMs = 250 } = {}
) => {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryablePrismaError(error) || attempt === retries) {
        throw error;
      }

      const waitMs = delayMs * (attempt + 1);
      console.warn(
        `${label} hit a transient database connection error. Retrying in ${waitMs}ms...`
      );
      await sleep(waitMs);
    }
  }

  throw lastError;
};
