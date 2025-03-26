"use client"
import { useTranslations } from "next-intl";
import Btn from "./Btn";

function Hero() {
    const t = useTranslations();
  
  return (
    <div>
      <h1 className="font-bold text-4xl self-start p-2 -ml-2">{t("Wallet Feature")}</h1>
      <p className="text-sm md:text-xl md:max-w-[550px]">{t("With the wallet feature")}</p>
      <Btn
      color="secondary"
      label={t("Create a wallet")}
      classname="self-start mt-4"
      />
    </div>
  );
}

export default Hero;
