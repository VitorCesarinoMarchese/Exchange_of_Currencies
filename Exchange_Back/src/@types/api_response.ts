export type ApiLiveRatesResponse = {
    symbol: string
    ts: string
    bid: number
    ask: number
    mid: number
};
export type ApiTimeSeriesResponse = {
    base_currency: string
    end_date: string
    endpoint: number
    quote_currency: number
    quotes: [{
        close: number
        date: string
        high: number
        low: number
        open: number    
    }
    ]
};

