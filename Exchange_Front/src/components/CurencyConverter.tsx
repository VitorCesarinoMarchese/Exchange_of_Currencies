import { useEffect, useMemo, useState } from "react";
import Dropdown from "./Dropdown";
import Input from "./Input";
import { useConvert } from "../hooks/convetHook";
import Btn from "./Btn";
import { useLocation } from "react-router";
import { exchangeService } from "../services/exchangeService";
import { transaction } from "../models/transactionModel";

function CurencyConverter({onTransaction}: {onTransaction: () => void}) {
  const [currency, setCurrency] = useState("USD");
  const [to, setTo] = useState(currency == "USD" ? "GBP" : "USD");
  const [amount, setAmount] = useState("100");
  const [transactionHandler, setTransactionHandler] = useState<transaction>({
    currency: `USDGBP`,
    amount: 0,
    user_id: localStorage.getItem("user_id") as string,
    rate: 0,
  });

  const location = useLocation();

  useEffect(() => setTo(currency === "USD" ? "GBP" : "USD"), [currency]);

  const userData = useMemo(
    () => ({ from: currency, to, amount }),
    [currency, to, amount]
  );

  const { data, error, loading } = useConvert(userData);

  useEffect(() => {
    if(Number(amount) < 0){
      console.error("Negatives numbers can't be used")
      return
    }
    if (data?.result?.rate && localStorage.getItem("user_id")) {
      setTransactionHandler({
        currency: `${currency}${to}`,
        amount: Number(amount),
        user_id: localStorage.getItem("user_id") as string,
        rate: data.result.rate,
      });
    }
  }, [data?.result?.rate, amount, currency, to]);

  return (
    <div>
      <h2 className="font-bold text-3xl self-start p-2">Curency Convert</h2>
      <div className="flex flex-col gap-4 bg-primary p-4 rounded-xl items-center">
        <Dropdown
          onChangeValue={(selectedCurrency: string) =>
            setCurrency(selectedCurrency)
          }
        />
        <Input
          type="number"
          placeholder="100"
          className="text-center"
          change={(e) => setAmount(e.target.value)  }
        />
        <Input
          type="text"
          placeholder={currency == "USD" ? "GBP" : "USD"}
          read={true}
          className="placeholder:text-black placeholder:text-center"
        />
        <Input
          type="number"
          placeholder={`${currency === "USD" ? "£" : "$"}${
            data?.result?.total ?? "100"
          }`}
          read={true}
          className="placeholder:text-black placeholder:text-center"
        />
        {location.pathname == "/dashboard" ? (
          <Btn
            label="Exchange"
            color="secondary"
            func={() => {
              if(Number(amount) < 0){
                return
              }
              exchangeService(transactionHandler);
              onTransaction(); 
            }}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default CurencyConverter;
