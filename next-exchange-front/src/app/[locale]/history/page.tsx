"use client"
import Navbar from "../../../components/Navbar";
import TransactionHistory from "../../../components/TransactionHistory";
import { useLogged } from "../../../hooks/loggedHook";

function History() {
  useLogged();
  
  return (
    <>
      <Navbar logged={true} />
      <div className="flex flex-col items-center p-4 gap-8">
        <TransactionHistory reloadTrigger={false}/>
      </div>
    </>
  );
}

export default History;
