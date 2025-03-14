import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";


function Dropdown({ onChangeValue }: {onChangeValue: (valeu: string) => void}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("USD");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleSelection = (selectedValue: string) =>{
    setValue(selectedValue);
    onChangeValue(selectedValue);
    toggleDropdown();
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="px-4 py-3 bg-white w-80 md:w-[300px] flex justify-between items-center gap-4 text-black rounded-xl border"
      >
        {value} <CaretDown size={14} />
      </button>
      {isOpen && (
        <ul className="absolute shadow-lg mt-2 w-80">
          <li
            className={
              "px-4 py-2 cursor-pointer" +
              " " +
              `${value == "USD" ? "bg-gray-200" : "bg-white"}`
            }
            onClick={() => {
              handleSelection("USD");
            }}
          >
            USD
          </li>
          <li
            className={
              "px-4 py-2 cursor-pointer" +
              " " +
              `${value == "GBP" ? "bg-gray-200" : "bg-white"}`
            }
            onClick={() => {
              handleSelection("GBP");
            }}
          >
            GBP
          </li>
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
