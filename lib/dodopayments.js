import DodoPayments from 'dodopayments';

const ENV = globalThis?.process?.env || {};
let dodoClient = null;

export const getDodo = () => {
  if (dodoClient) {
    return dodoClient;
  }

  const bearerToken = ENV.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) {
    throw new Error(
      "The DODO_PAYMENTS_API_KEY environment variable is missing or empty."
    );
  }

  dodoClient = new DodoPayments({
    bearerToken,
    environment: "test_mode", // Required for test_sk_ keys
  });

  return dodoClient;
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
