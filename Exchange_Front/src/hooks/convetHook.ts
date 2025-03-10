import { useEffect, useState } from "react";
import { fetchPostApi } from "../services/apiService";
import { ConversionResponse } from "../models/conversionResponse";

export const useConvert = (userData: {
  from: string;
  to: string;
  amount: string;
}) => {
    const [data, setData] = useState<ConversionResponse | null>(null)
    const [error, setError] = useState<ConversionResponse | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!userData.amount) return; 
        if (Number(userData.amount) < 0) return
        let isMounted = true; 
    
        const fetchData = async () => {
          setLoading(true);
          setError(null);
    
          try {
            const response = await fetchPostApi("conversion", userData);
            const result = await response.json();
    
            if (!isMounted) return;
    
            if (response.status !== 200) {
              console.log(userData.from, userData.to)
              setError(result);
              console.error("Conversion failed:", result);
              return;
            }
    
            setData(result);
          } catch (e) {
            if (!isMounted) return;
            console.error("Conversion error:", e);
            setError({ error: "Conversion failed." });
          } finally {
            if (isMounted) setLoading(false);
          }
        };
    
        fetchData();
    
        return () => {
          isMounted = false; 
        };
      }, [userData]); 
        return {data, error, loading}
};
