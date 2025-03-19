import { useEffect, useState } from "react"
import { fetchAuthApi } from "../services/apiService"

interface apiWalletResponse{
    wallet:{
        usd: number
        gbp: number
    }
}
interface Wallet{
        usd: number
        gbp: number
}

export const useWallet = (trigger: boolean) =>{
    const [walletData, setWalletData] = useState<Wallet | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setWalletData(null);
        setLoading(true);
        fetchAuthApi(`exchange/wallet/${localStorage.getItem("user_id")}`, localStorage.getItem("access_token") as string)
          .then((response) => response.json())
          .then((data: apiWalletResponse) => {
            setWalletData(data.wallet);
          })
          .catch((e) => {
            console.error("Error fetching data:", e);
            setError("Failed to load wallet data. Please try again later.");
          })
          .finally(() => setLoading(false));
      }, [trigger]);
    return {walletData, loading, error}
}