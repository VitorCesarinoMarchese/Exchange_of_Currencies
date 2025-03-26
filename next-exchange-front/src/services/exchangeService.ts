import { transaction, transactionResponse } from "../models/transactionModel";
import { fetchAuthPostApi } from "./apiService";

export const exchangeService = async (transaction: transaction) => {
  try {
    const accessToken = localStorage.getItem("access_token")
    if(!accessToken){
        return "Unable to find accessToken"
    }
    const response = await fetchAuthPostApi("exchange/transaction", transaction, accessToken)
    const data: transactionResponse = await response.json()
    return {data, error: null, loading: false}
  } catch (e) {
    console.error(e);
    return { data: null, error: "Error trying to execute the transaction", loading: false };
  }
};

export const addFundsService = async (funds: {usd: number, gbp:number}) => {
  try {
    const accessToken = localStorage.getItem("access_token")
    const user_id = localStorage.getItem("user_id")
    if(!accessToken || !user_id){
      return "Unable to find accessToken"
    }
    console.log(funds.usd > 0)
    const response = await fetchAuthPostApi(`exchange/addfunds/${user_id}`, funds, accessToken)
    const data = await response.json()
    return {data, error: null, loading: false}
  } catch (e) {
    console.error(e)
  }
}