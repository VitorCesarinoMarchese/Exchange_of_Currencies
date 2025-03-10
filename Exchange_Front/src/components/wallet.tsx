import { useLocation } from "react-router";
import { useWallet } from "../hooks/walletHook";
import Input from "./Input";
import Btn from "./Btn";

function Wallet({ reloadTrigger, onChangeValue }: {reloadTrigger: boolean, onChangeValue?: (value: boolean) => void}) {
  const location = useLocation()
  const { walletData, loading, error } = useWallet(reloadTrigger);
  return (
    <div>
      <h2 className="font-bold text-3xl self-start p-2">My wallet</h2>
      <div className="flex flex-col items-center gap-4 m-4 p-4 bg-primary rounded-lg">
        <div className="flex justify-center gap-2">
          <Input
            type="Text"
            placeholder="USD"
            className="placeholder:text-black text-center"
            w="w-40"
            read={true}
          />
          <Input
            type="Text"
            placeholder="GBP"
            className="placeholder:text-black text-center"
            w="w-40"
            read={true}
          />
        </div>
        <div className="flex justify-center gap-2">
          <Input
            type="Number"
            placeholder={`${loading ? "loading...": walletData?.usd.toFixed(2)}$`}
            className="placeholder:text-black text-center"
            w="w-40"
            read={true}
          />
          <Input
            type="Number"
            placeholder={`£${loading ? "loading...": walletData?.gbp.toFixed(2)}`}
            className="placeholder:text-black text-center"
            w="w-40"
            read={true}
          />
        </div>
        {location.pathname == "/dashboard"? <Btn label="Add founds" color="secondary" func={() => onChangeValue(true)}/> : <></>}
      </div>
    </div>
  );
}

export default Wallet;
