export interface apiChartModel{
    result: {
        base_currency: string;
        end_date: string;
        endpoint: string;
        quote_currency: string;
        quotes: Quote[];
        request_time: string;
        start_date: string;
    }
}
export type Quote = {
    close: number;
    date: string;
    high: number;
    low: number;
    open: number;
  };
  
export interface usableChart{
    close: number
    x: string
    high: number
    low: number
    open: number
}