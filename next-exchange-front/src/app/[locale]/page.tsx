"use client"
import { redirect } from 'next/navigation'
import Chart from "../../components/Chart";
import CurencyConverter from "../../components/CurencyConverter";
import Hero from "../../components/Hero";
import Infocard from "../../components/Infocard";
import Navbar from "../../components/Navbar";
import Wallet from "../../components/wallet";
import { useLogged } from "../../hooks/loggedHook";
import { useTranslations } from 'next-intl';

 

function Home() {
    const t = useTranslations();
  const { logged } = useLogged();
  const handleRedirect = () => {
    window.location.href = 'https://tradermade.com/';
  };
  if (logged) {
    return (
      <>
        <div className="hidden bg-secondary"></div>
        <Navbar logged={logged} />
        <div className="flex flex-col items-center p-4 gap-8 md:p-10 md:flex-row md:flex-wrap md:justify-between md:items-start">
          <div className="flex flex-col justify-between md:h-[330px]">
            <Wallet reloadTrigger={false}/>
            <CurencyConverter onTransaction={() => {}} className="hidden md:flex md:flex-col mt-8" />
          </div>
          <Chart className="hidden md:flex" />
          <CurencyConverter onTransaction={() => {}} className="md:hidden" />
          <Chart className="md:hidden" />
          <Infocard
            title={t("Recent Transactions")}
            text={t("Track your recent transactions")}
            label={t("Transactions")}
            className="md:w-[45vw] md:max-w-[45vw]"
            func={() => redirect("/history")}
          />
          <Infocard
            title={t("Powerd by web sockets")}
            text={t("WebSockets enable real-time communication, allowing the use the most up-to-date live exchange rates")}
            label={t("More Info")}
            className="md:w-[45vw] md:max-w-[45vw]"
            func={handleRedirect}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="hidden bg-secondary"></div>
        <Navbar logged={logged} />
        <div className="flex flex-col items-center p-4 gap-8 md:p-10 md:flex-row md:flex-wrap md:justify-between md:items-start">
          <div>
            <Hero />
            <CurencyConverter onTransaction={() => {}} className="hidden md:flex md:flex-col mt-8" />
          </div>
          <Chart className="hidden md:flex" />
          <CurencyConverter onTransaction={() => {}} className="md:hidden" />
          <Chart className="md:hidden" />
          <Infocard
            title={t("Recent Transactions")}
            text={t("Track your recent transactions")}
            label={t("Transactions")}
            className="md:w-[45vw] md:max-w-[45vw]"
            func={() => redirect("/login")}
          />
          <Infocard
            title={t("Powerd by web sockets")}
            text={t("WebSockets enable real-time communication, allowing the use the most up-to-date live exchange rates")}
            label={t("More Info")}
            className="md:w-[45vw] md:max-w-[45vw]"
            func={() => handleRedirect()}
          />
        </div>
      </>
    );
  }
}

export default Home;
