"use client"
import { useEffect, useState } from "react";
import CurencyConverter from "../../../components/CurencyConverter";
import Navbar from "../../../components/Navbar";
import Wallet from "../../../components/wallet";
import TransactionHistory from "../../../components/TransactionHistory";
import { useLogged } from "../../../hooks/loggedHook";
import AddFunds from "../../../components/addFunds";
import Footer from "@/components/Footer";

function Dashboard() {
  const [reloadTrigger, setReloadTrigger] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  useLogged();
  useEffect(() => {
    setTimeout(() => {
      setReloadTrigger((prev: boolean) => !prev);
    }, 100);
  }, [open]);
  const handleTransaction = () => {
    setTimeout(() => {
      setReloadTrigger((prev: boolean) => !prev);
    }, 100);
  };

  return (
    <>
      <Navbar logged={true} />
      <div className="flex flex-col items-center p-4 gap-8 min-h-[80vh]">
        <Wallet
          reloadTrigger={reloadTrigger}
          onChangeValue={(value: boolean) => {
            setOpen(value);
          }}
        />
        {open ? (
          <AddFunds onChangeValue={(change: boolean) => setOpen(change)} />
        ) : (
          <></>
        )}

        <CurencyConverter onTransaction={handleTransaction} />
        <TransactionHistory reloadTrigger={reloadTrigger} />
      </div>
      <Footer/>
    </>
  );
}

export default Dashboard;
