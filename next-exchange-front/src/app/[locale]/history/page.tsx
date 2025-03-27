"use client"
import Footer from "@/components/Footer";
import Navbar from "../../../components/Navbar";
import TransactionHistory from "../../../components/TransactionHistory";
import { useLogged } from "../../../hooks/loggedHook";

function History() {
  useLogged();
  
  return (
    <>
      <Navbar logged={true} />
      <div className="flex flex-col items-center p-4 gap-8 min-h-[80vh]">
        <TransactionHistory reloadTrigger={false}/>
      </div>
      <Footer/>
    </>
  );
}

export default History;
