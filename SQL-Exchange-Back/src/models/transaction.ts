export interface TransactionModel {
    id: number,
    user_id: number,
    amount: number,
    from: string,
    to: string,
    rate: number,
    transaction_date: string,
};
export interface TransactionsResponse {
    transactions: TransactionModel[];
}