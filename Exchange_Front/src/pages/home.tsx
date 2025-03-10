import Chart from "../components/Chart";
import CurencyConverter from "../components/CurencyConverter";
import Hero from "../components/Hero";
import Infocard from "../components/Infocard";
import Navbar from "../components/Navbar";
import Wallet from "../components/wallet";
import { useLogged } from "../hooks/loggedHook";
function Home() {
  const { logged } = useLogged();
  if (logged) {
    return (
      
      <>
        <div className="hidden bg-secondary"></div>
        <Navbar logged={logged} />
        <div className="flex flex-col items-center p-4 gap-8">
          <Wallet />
          <CurencyConverter />
          <Chart />
          <Infocard
            title="Recent Transactions"
            text="Track your recent transactions, like USD to GBP, easily. View details like amounts, exchange rates, and transaction dates."
            label="Transactions"
          />
          <Infocard
            title="Powerd by web sockets"
            text="WebSockets enable real-time communication, allowing the use the most up-to-date live exchange rates."
            label="More Info"
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="hidden bg-secondary"></div>
        <Navbar logged={logged} />
        <div className="flex flex-col items-center p-4 gap-8">
          <Hero />
          <CurencyConverter />
          <Chart />
          <Infocard
            title="Recent Transactions"
            text="Track your recent transactions, like USD to GBP, easily. View details like amounts, exchange rates, and transaction dates."
            label="Transactions"
          />
          <Infocard
            title="Powerd by web sockets"
            text="WebSockets enable real-time communication, allowing the use the most up-to-date live exchange rates."
            label="More Info"
          />
        </div>
      </>
    );
  }
}

export default Home;
