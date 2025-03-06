import { useState } from "react";
import Dropdown from "./Dropdown";
import Input from "./Input";

function CurencyConverter() {
    const [currency, setCurrency] = useState("USD")
    return ( <div>
        <h2 className="font-bold text-3xl self-start p-2">Curency Convert</h2>
        <div className="flex flex-col gap-4 bg-primary p-4 rounded-4xl">
            <Dropdown 
            onChangeValue={(selectedCurrency: string) => setCurrency(selectedCurrency)}
            />
            <Input 
            type="number"
            placeholder="100"
            className="text-center"
            />
            <Input 
            type="text"
            placeholder={currency == "USD"? "GBP" : "USD"}
            read={true}
            className="placeholder:text-black placeholder:text-center"
            />
            <Input 
            type="number"
            placeholder={`${currency == "USD"? "£": "$"}100`}
            read={true}
            className="placeholder:text-black placeholder:text-center"
            />
        </div>
    </div> );
}

export default CurencyConverter;