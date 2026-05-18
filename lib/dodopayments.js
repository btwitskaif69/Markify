import DodoPayments from 'dodopayments';

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'test_mode', // Required for test_sk_ keys
});
