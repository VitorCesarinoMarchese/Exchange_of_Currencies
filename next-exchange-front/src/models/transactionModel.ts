export interface transaction {
  currency: string;
  amount: number;
  user_id?: string;
  rate: number;
}
export interface recentTransaction {
    _id: string;
    user_id: string;
    amount: string;
    from: string;
    to: string;
    rate: string;
    transaction_date: string;
    __v: number;
  }  
export interface transactionResponse {
  document: recentTransaction;
  total: number;
}
