import { conversion } from "./conversionFunctions";

export const exchangeLogic = async (
  usd: number,
  gbp: number,
  amount: number,
  currency: string
): Promise<{ total?: string; rate?: number; error?: string }> => {
  let conversionData = {
    from: "",
    to: "",
    amount: `${amount}`
  };

  if (currency === "USDGBP") {
    if (usd < amount) {
      return { error: "Not enough funds" };
    }
    conversionData.from = "USD";
    conversionData.to = "GBP";
    return await conversion(conversionData);
  }

  if (currency === "GBPUSD") {
    if (gbp < amount) {
      return { error: "Not enough funds" };
    }
    conversionData.from = "GBP";
    conversionData.to = "USD";
    return await conversion(conversionData);
  }

  return { error: "Invalid currency type" };
};
