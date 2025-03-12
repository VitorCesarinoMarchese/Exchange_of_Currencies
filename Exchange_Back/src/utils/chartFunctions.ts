import { ApiTimeSeriesResponse } from "../@types/api_response";

export const dayChart = async (currency: string) => {
  const today = new Date();
  const start = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-00:00`;
  const end = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}:00`;

  try {
    const response = await fetch(
      `${process.env.URL_REST}timeseries?api_key=${process.env.API_KEY}&currency=${currency}&format=records&start_date=${start}&end_date=${end}&interval=hourly&period=1`
    );

    if (!response.ok) {
      return {error: `API request failed with status ${response.status}`};
    }

    const apiData: ApiTimeSeriesResponse = await response.json();
    return apiData;
  } catch (error) {
    console.log(`${process.env.URL_REST}timeseries?api_key=${process.env.API_KEY}&currency=${currency}&format=records&start_date=${start}&end_date=${end}&interval=hourly&period=1`)
    console.error("Error fetching day chart data:");
    return { error: `Failed to fetch day chart data` };
  }
};

export const weekChart = async (currency: string) => {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const start = `${lastWeek.getFullYear()}-${lastWeek.getMonth() + 1}-${lastWeek.getDate()}-00:00`;
  const end = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}:${today.getMinutes()}`;
  try {
    const response = await fetch(
      `${process.env.URL_REST}timeseries?api_key=${process.env.API_KEY}&currency=${currency}&format=records&start_date=${start}&end_date=${end}&interval=daily&period=1`
    );

    if (!response.ok) {
      return {error: `API request failed with status ${response.status}`};
    }

    const apiData: ApiTimeSeriesResponse = await response.json();
    return apiData;
  } catch (error) {
    console.error("Error fetching week chart data:", error);
    return { error: "Failed to fetch week chart data" };
  }
};

export const monthChart = async (currency: string) => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const start = `${lastMonth.getFullYear()}-${lastMonth.getMonth() + 1}-${lastMonth.getDate()}-00:00`;
  const end = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}:${today.getMinutes()}`;

  try {
    const response = await fetch(
      `${process.env.URL_REST}timeseries?api_key=${process.env.API_KEY}&currency=${currency}&format=records&start_date=${start}&end_date=${end}&interval=daily&period=1`
    );

    if (!response.ok) {
      return {error: `API request failed with status ${response.status}`};
    }

    const apiData: ApiTimeSeriesResponse = await response.json();
    return apiData;
  } catch (error) {
    console.error("Error fetching month chart data:", error);
    return { error: "Failed to fetch month chart data" };
  }
};

export const yearChart = async (currency: string) => {
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);

  const start = `${lastYear.getFullYear()}-${lastYear.getMonth() + 1}-${lastYear.getDate()}-00:00`;
  const end = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}:${today.getMinutes()}`;

  try {
    const response = await fetch(
      `${process.env.URL_REST}timeseries?api_key=${process.env.API_KEY}&currency=${currency}&format=records&start_date=${start}&end_date=${end}&interval=daily&period=1`
    );

    if (!response.ok) {
      return {error: `API request failed with status ${response.status}`};
    }

    const apiData: ApiTimeSeriesResponse = await response.json();
    return apiData;
  } catch (error) {
    console.error("Error fetching year chart data:", error);
    return { error: "Failed to fetch year chart data" };
  }
};
