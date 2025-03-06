import { useEffect, useState } from "react";
import { apiChartModel, usableChart } from "../models/chartModel";
import { fetchGetApi } from "../services/apiService";

export const useCharts = (chartType: string) => {
  const [chartData, setChartData] = useState<usableChart[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setChartData([])
    setLoading(true);
    fetchGetApi(`chart/${chartType}`)
      .then((data: apiChartModel) => {
        setChartData((prevChart) => [
          ...prevChart,
          ...data.result.quotes.map((quote) => ({
            close: quote.close,
            x: chartType === "day/USDGBP" ? quote.date.split(" ")[1].substring(0, 5) : quote.date,
            high: quote.high,
            low: quote.low,
            open: quote.open,
          })),
        ]);
      })
      .catch((e) => {
        console.error("Error fetching data:", e);
        setError("Failed to load chart data. Please try again later."); 
      })
      .finally(() => setLoading(false));
  }, [chartType]);

  return { chartData, loading, error };
};
