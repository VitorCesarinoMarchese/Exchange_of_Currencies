import { getExchangeRates } from "./webSocket";  

export const conversion = async (userData: { from: string, to: string, amount: string }) => {
    const { GBPUSD, USDGBP } = getExchangeRates();

    const GBPtoUSDCheck = userData.from === "GBP" && userData.to === "USD";
    const USDtoGBPCheck = userData.from === "USD" && userData.to === "GBP";

    if (!(GBPtoUSDCheck || USDtoGBPCheck)) {
        throw new Error("Invalid currency pair");
    }

    let total: number = 0;

    if (GBPtoUSDCheck) {
        total = GBPUSD * parseFloat(userData.amount);
    } else if (USDtoGBPCheck) {
        total = USDGBP * parseFloat(userData.amount);
    }

    return total.toFixed(2);
};
