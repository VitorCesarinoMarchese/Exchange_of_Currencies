import { conversionBody } from "../@types/conversionBody";
import { getExchangeRates } from "./webSocket";

export const conversion = async (userData: conversionBody): Promise<{ total?: number; rate?: number; error?: string }> => {
  const { GBPUSD, USDGBP } = getExchangeRates();

  if (!GBPUSD || !USDGBP) {
    return { error: "Exchange rates not available" };
  }

  const GBPtoUSDCheck = userData.from === "GBP" && userData.to === "USD";
  const USDtoGBPCheck = userData.from === "USD" && userData.to === "GBP";

  if (!(GBPtoUSDCheck || USDtoGBPCheck)) {
    return { error: "Invalid currency pair" };
  }

  let rate = GBPtoUSDCheck ? GBPUSD : USDGBP;
  const total = Number((rate * userData.amount).toFixed(2));

  return { total, rate };
};
