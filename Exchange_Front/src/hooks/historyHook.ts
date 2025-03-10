import { useEffect, useState } from "react";
import { fetchAuthApi } from "../services/apiService";
import { recentTransaction } from "../models/transactionModel";


interface HistoryHook {
    history: recentTransaction[];
    loading: boolean;
    error: string | null;
  }

export const useHistory = (trigger: boolean): HistoryHook => {
    const [history, setHistory] = useState<recentTransaction[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    
    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const accessToken = localStorage.getItem("access_token");
        if (!userId || !accessToken) {
            setError("User is not authenticated.");
            setLoading(false);
            return;
        }
        setHistory([]);
        setLoading(true);
        fetchAuthApi(`exchange/transaction_history/${localStorage.getItem("user_id")}`, localStorage.getItem("access_token") as string)
          .then((response) => response.json())
          .then((data: { recentTransactions: recentTransaction[] }) => {
            setHistory(data.recentTransactions); 
          })
          .catch((e) => {
            console.error("Error fetching data:", e);
            setError("Failed to load wallet data. Please try again later.");
          })
          .finally(() => setLoading(false));
      }, [trigger]);
    return {history, loading, error}
}