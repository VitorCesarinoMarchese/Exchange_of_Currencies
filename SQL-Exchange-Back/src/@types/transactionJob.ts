export interface TransactionJob {
  wallet_id: number;
  user_id: number;
  amount: number;
  type: "addFunds" | "exchange";
  usd: number;
  gbp: number;
  from: "usd" | "gbp";
  to: "usd" | "gbp";
  rate: number;
}
