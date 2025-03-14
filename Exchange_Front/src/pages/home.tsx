import { useNavigate } from "react-router";
import Chart from "../components/Chart";
import CurencyConverter from "../components/CurencyConverter";
import Hero from "../components/Hero";
import Infocard from "../components/Infocard";
import Navbar from "../components/Navbar";
import Wallet from "../components/wallet";
import { useLogged } from "../hooks/loggedHook";
function Home() {
  const { logged } = useLogged();
  const navigate = useNavigate();
  const handleRedirect = () => {
    console.log('https://tradermade.com/')
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
            <CurencyConverter className="hidden md:flex md:flex-col mt-8" />
          </div>
          <Chart className="hidden md:flex" />
          <CurencyConverter className="md:hidden" />
          <Chart className="md:hidden" />
          <Infocard
            title="Recent Transactions"
            text="Track your recent transactions, like USD to GBP, easily. View details like amounts, exchange rates, and transaction dates."
            label="Transactions"
            className="md:w-[45vw] md:max-w-[45vw]"
            func={() => navigate("/history")}
          />
          <Infocard
            title="Powerd by web sockets"
            text="WebSockets enable real-time communication, allowing the use the most up-to-date live exchange rates."
            label="More Info"
            className="md:w-[45vw] md:max-w-[45vw]"
            func={() => handleRedirect()}
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
            <CurencyConverter className="hidden md:flex md:flex-col mt-8" />
          </div>
          <Chart className="hidden md:flex" />
          <CurencyConverter className="md:hidden" />
          <Chart className="md:hidden" />
          <Infocard
            title="Recent Transactions"
            text="Track your recent transactions, like USD to GBP, easily. View details like amounts, exchange rates, and transaction dates."
            label="Transactions"
            className="md:w-[45vw] md:max-w-[45vw]"
            func={() => navigate("/login")}
          />
          <Infocard
            title="Powerd by web sockets"
            text="WebSockets enable real-time communication, allowing the use the most up-to-date live exchange rates."
            label="More Info"
            className="md:w-[45vw] md:max-w-[45vw]"
            func={() => handleRedirect()}
          />
        </div>
      </>
    );
  }
}

export default Home;
