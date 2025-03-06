import { conversion } from "./conversionFunctions";

export const exchangeLogic = (
  usd: number,
  gpb: number,
  amount: number,
  currency: string
) => {
    let conversionData = {
        from: "",
        to: "",
        amount: `${amount}`
    }
    if(currency == "USDGBP"){
        if(usd < amount){
            return "not enoght founds"
        }
        conversionData.from = "USD"
        conversionData.to = "GBP"
        return conversion(conversionData)
    }
    if(currency == "GBPUSD"){
        if(gpb < amount){
            return "not enoght founds"
        }
        conversionData.from = "GBP"
        conversionData.to = "USD"
        return conversion(conversionData)
    }
};
