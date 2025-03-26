import { useEffect, useState } from "react";
import { fetchAuthApi } from "../services/apiService";
import { recentTransaction } from "../models/transactionModel";

interface HistoryHook {
  history: recentTransaction[];
  loading: boolean;
  error: string | null;
}

export const useHistory = (trigger: boolean): HistoryHook => {
  const [history, setHistory] = useState<recentTransaction[]>([]);
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

    fetchAuthApi(
      `exchange/transaction_history/${userId}`,
      accessToken as string
    )
      .then((response) => response.json())
      .then((data: { recentTransactions: recentTransaction[]  } | {error: string}) => {
        if("recentTransactions" in data){
          setHistory(data.recentTransactions);
          setError(null); 
        }else{
          setError("Failed to load transaction history.");
        }
      })
      .catch((e) => {
        setError("Failed to load transaction history."); 
      })
      .finally(() => setLoading(false));
  }, [trigger]);

  return { history, loading, error };
};
