"use client"
import { useEffect, useMemo, useState } from "react";
import Dropdown from "./Dropdown";
import Input from "./Input";
import { useConvert } from "../hooks/convetHook";
import Btn from "./Btn";
import { usePathname } from 'next/navigation'
import { exchangeService } from "../services/exchangeService";
import { transaction } from "../models/transactionModel";

function CurencyConverter({onTransaction, className}: {onTransaction?: () => void, className?: string}) {
  const [currency, setCurrency] = useState("USD");
  const [to, setTo] = useState(currency == "USD" ? "GBP" : "USD");
  const [amount, setAmount] = useState("100");
  const [transactionHandler, setTransactionHandler] = useState<transaction>({
    currency: `USDGBP`,
    amount: 100,
    rate: 0.77,
  });

  const location = usePathname();

  useEffect(() => setTo(currency === "USD" ? "GBP" : "USD"), [currency]);

  const userData = useMemo(
    () => ({ from: currency, to, amount }),
    [currency, to, amount]
  );

  const { data, error, loading } = useConvert(userData);
  useEffect(() => {
    if(Number(amount) <= 0){
      return
    }
    if (data?.result?.rate && localStorage.getItem("user_id")) {
      setTransactionHandler({
        currency: `${currency == "USD" ? "USDGBP" : "GBPUSD"}`,
        amount: Number(amount),
        user_id: localStorage.getItem("user_id") as string,
        rate: data.result.rate,
      });
    }
  }, [data?.result?.rate, amount, currency, to]);

  return (
    <div className={"md:max-w-[675px]" + ' ' + className}>
      <h2 className="font-bold text-3xl self-start p-2">Curency Convert</h2>
      <span className="text-red-500">{Number(amount) <= 0 ? "Negatives numbers and zero can't be used": ""}</span>
      <div className="flex flex-col gap-4 bg-primary p-4 rounded-xl items-center md:w-[675px] md:flex-row md:flex-wrap md:justify-center">
        <Dropdown
          onChangeValue={(selectedCurrency: string) =>
            setCurrency(selectedCurrency)
          }
        />
        <Input
          type="number"
          placeholder="100"
          className="text-center"
          w="w-80 md:w-[300px]"
          change={(e) => setAmount(e.target.value)  }
        />
        <Input
          type="text"
          placeholder={currency == "USD" ? "GBP" : "USD"}
          read={true}
          w="w-80 md:w-[300px]"
          className="placeholder:text-black placeholder:text-center"
        />
        <Input
          type="number"
          placeholder={`${currency === "USD" ? "£" : "$"}${
            data?.result?.total ?? "100"
          }`}
          read={true}
          w="w-80 md:w-[300px]"
          className="placeholder:text-black placeholder:text-center"
        />
        {location == "/dashboard" ? (
          <Btn
            label="Exchange"
            color="secondary"
            w="w-80 md:w-[300px]"
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
