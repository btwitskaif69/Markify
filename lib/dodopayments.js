import DodoPayments from 'dodopayments';

const ENV = globalThis?.process?.env || {};
const dodoClients = new Map();
let unsafeDodoClient = null;

const getDodoEnvironment = () => {
  const configuredEnvironment = ENV.DODO_PAYMENTS_ENVIRONMENT?.trim();
  if (configuredEnvironment === "test_mode" || configuredEnvironment === "live_mode") {
    return configuredEnvironment;
  }

  return ENV.NODE_ENV === "production" ? "live_mode" : "test_mode";
};

export const getDodoEnvironmentCandidates = () => {
  const preferred = getDodoEnvironment();
  const fallback = preferred === "live_mode" ? "test_mode" : "live_mode";
  return [preferred, fallback];
};

export const getDodo = (environment = getDodoEnvironment()) => {
  const bearerToken = ENV.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) {
    throw new Error(
      "The DODO_PAYMENTS_API_KEY environment variable is missing or empty."
    );
  }

  if (!dodoClients.has(environment)) {
    dodoClients.set(
      environment,
      new DodoPayments({
        bearerToken,
        environment,
      })
    );
  }

  return dodoClients.get(environment);
};

export const getDodoUnsafeClient = () => {
  if (!unsafeDodoClient) {
    unsafeDodoClient = new DodoPayments({
      bearerToken: ENV.DODO_PAYMENTS_API_KEY || "__unsafe_parse_only__",
      environment: getDodoEnvironment(),
    });
  }

  return unsafeDodoClient;
};

const getDodoErrorStatus = (error) => {
  const status = error?.status ?? error?.response?.status ?? error?.cause?.status;
  if (typeof status === "number") {
    return status;
  }

  const message = String(error?.message || "");
  const messageStatus = message.match(/\b401\b/);
  return messageStatus ? 401 : null;
};

const isUnauthorizedDodoError = (error) => {
  const status = getDodoErrorStatus(error);
  if (status === 401) {
    return true;
  }

  return /unauthorized/i.test(String(error?.message || ""));
};

export const withDodoFallback = async (runner) => {
  const environments = getDodoEnvironmentCandidates();
  let lastError = null;

  for (const environment of environments) {
    try {
      return await runner(getDodo(environment), environment);
    } catch (error) {
      lastError = error;
      const isLastAttempt = environment === environments[environments.length - 1];
      if (!isUnauthorizedDodoError(error) || isLastAttempt) {
        throw error;
      }

      console.warn(
        `Dodo request returned 401 in ${environment}; retrying in ${environments[1] || environment}.`
      );
    }
  }

  throw lastError;
};

export const dodo = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getDodo();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);
