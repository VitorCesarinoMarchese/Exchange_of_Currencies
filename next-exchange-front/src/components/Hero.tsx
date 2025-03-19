"use client"
import Btn from "./Btn";

function Hero() {
  return (
    <div>
      <h1 className="font-bold text-4xl self-start p-2 -ml-2">Wallet Feature</h1>
      <p className="text-sm md:text-xl md:max-w-[550px]">
        With the wallet feature, users can easily manage their balances in USD
        and GBP. It offers an easy-to-use interface for tracking balances,
        making transfers, and managing funds across different currencies.{" "}
      </p>
      <Btn
      color="secondary"
      label="Create a wallet"
      classname="self-start mt-4"
      />
    </div>
  );
}

export default Hero;
