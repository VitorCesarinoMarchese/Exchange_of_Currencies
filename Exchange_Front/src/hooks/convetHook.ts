import { useEffect, useState } from "react";
import { fetchPostApi } from "../services/apiService";
import { ConversionResponse } from "../@types/conversionResponse";

export const useConvert = (userData: {
  from: string;
  to: string;
  amount: string;
}) => {
  const [data, setData] = useState<ConversionResponse | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userData.amount || Number(userData.amount) <= 0) return; 
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPostApi("conversion", userData);

        let result;
        try {
          result = await response.json(); 
        } catch {
          setError("Invalid response from server.");
          setLoading(false);
          return;
        }

        if (response.status !== 200) {
          setError(result.error || "Conversion failed."); 
        }

        setData(result);
      } catch (e) {
        setError("Conversion failed. " + {e}); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]); 

  return { data, error, loading };
};
