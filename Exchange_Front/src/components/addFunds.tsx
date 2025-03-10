import { X } from "@phosphor-icons/react";
import Btn from "./Btn";
import Input from "./Input";
import { addFunds } from "../services/exchangeService";
import { useState } from "react";

function AddFunds({ onChangeValue }: { onChangeValue: (value: boolean) => void }) {
    const [usd, setUSD] = useState(0)
    const [gbp, setGBP] = useState(0)
    const handleAddFunds = () => {
        onChangeValue(false);
        addFunds({usd, gbp})
    };

    return (
        <>
            {/* Overlay to darken the background */}
            <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => onChangeValue(false)}></div>

            {/* Modal content centered over other divs */}
            <div className="fixed inset-0 flex items-center justify-center z-20">
                <div className="bg-primary rounded-xl flex flex-col items-center gap-4 p-4 relative">
                    {/* Close icon */}
                    <X size={32} className="self-start -mb-8" onClick={() => onChangeValue(false)} />
                    <h2 className="font-bold text-secondary text-2xl">Add funds</h2>
                    <Input
                        type="text"
                        placeholder="USD"
                        read={true}
                        className="placeholder:text-black placeholder:text-center"
                        />
                    <Input
                        type="number"
                        placeholder="100.00$"
                        className='text-center'
                        change={(e) => setUSD(e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="GBP"
                        read={true}
                        className="placeholder:text-black placeholder:text-center"
                    />
                    <Input
                        type="number"
                        placeholder="100.00£"
                        className='text-center'
                        change={(e) => setGBP(e.target.value)}
                    />
                    <Btn
                        label="Confirm"
                        color="secondary"
                        func={handleAddFunds} // Pass the function to Btn here
                    />
                </div>
            </div>
        </>
    );
}

export default AddFunds;
