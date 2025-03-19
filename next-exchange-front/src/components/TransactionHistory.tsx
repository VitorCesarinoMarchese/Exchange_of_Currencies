"use client"
import { useEffect, useState } from "react";
import { useHistory } from "../hooks/historyHook";
import Btn from "./Btn";
import { usePathname } from 'next/navigation';

function TransactionHistory({ reloadTrigger, page = 5 }: { reloadTrigger: boolean; page?: number }) {
  const { history, loading, error } = useHistory(reloadTrigger);
  const [sortHistory, setSortHistory] = useState(history);
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const location = usePathname()

  const itemsPerPage = page;

  useEffect(() => {
    setSortHistory(history);
    setCurrentPage(1); 
  }, [location, history]);


  const formatDate = (transactionDate: string) => {
    const date = new Date(transactionDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return { formattedDate: `${day}/${month}`, formattedYear: `${year}` };
  };

  const dateFilter = () => {
    const sortedHistory = history
      .slice()
      .sort((a, b) =>
        isAscending
          ? new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
          : new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
      );
    setSortHistory(sortedHistory);
    setIsAscending(!isAscending);
  };
  const fromFilter = () => {
    const sortedHistory = history
      .slice()
      .sort((a, b) =>
        isAscending ? a.from.localeCompare(b.from) : b.from.localeCompare(a.from)
      );
    setSortHistory(sortedHistory);
    setIsAscending(!isAscending);
  };
  const amountFilter = () => {
    const sortedHistory = history
      .slice()
      .sort((a, b) =>
        isAscending
          ? Number(a.amount) - Number(b.amount)
          : Number(b.amount) - Number(a.amount)
      );
    setSortHistory(sortedHistory);
    setIsAscending(!isAscending);
  };
  const rateFilter = () => {
    const sortedHistory = history
      .slice()
      .sort((a, b) =>
        isAscending
          ? Number(a.rate) - Number(b.rate)
          : Number(b.rate) - Number(a.rate)
      );
    setSortHistory(sortedHistory);
    setIsAscending(!isAscending);
  };

  useEffect(() => {
    setSortHistory(history);
    setCurrentPage(1);
  }, [history]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHistory = sortHistory.slice(startIndex, endIndex);

  return (
    <div className="py-4">
      <h2 className="font-bold text-3xl self-start p-2">Transaction History</h2>
      <div className="max-w-[343px] md:max-w-[675px]">
        <table className="border-collapse w-full table-fixed rounded-lg overflow-hidden" key={history.length}>
          <thead>
            <tr className="bg-primary text-center rounded-xl">
              <th className="px-2 py-2 text-xs w-1/4">
                <div className="truncate">
                  <Btn label="Rate" color="secondary" w="w-full" classname="text-lg md:text-xl font-normal" func={rateFilter} />
                </div>
              </th>
              <th className="px-2 py-2 text-xs w-1/4">
                <div className="truncate">
                  <Btn label="Amount" color="secondary" w="w-full" classname="text-lg md:text-xl font-normal" func={amountFilter} />
                </div>
              </th>
              <th className="px-2 py-2 text-xs w-1/4">
                <div className="truncate">
                  <Btn label="From" color="secondary" w="w-full" classname="text-lg md:text-xl font-normal" func={fromFilter} />
                </div>
              </th>
              <th className="px-2 py-2 text-xs w-1/4">
                <div className="truncate">
                  <Btn label="Date" color="secondary" w="w-full" classname="text-lg md:text-xl font-normal" func={dateFilter} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="border">
            {loading ? (
              <tr className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 text-xs md:text-lg truncate">Loading ...</td>
                <td className="px-4 py-2 text-xs md:text-lg truncate">Loading ...</td>
                <td className="px-4 py-2 text-xs md:text-lg truncate">Loading ...</td>
                <td className="px-4 py-2 text-xs md:text-lg text-center">
                  <div className="flex flex-col items-center">
                    <span>Loading .../</span>
                    <span>Loading ...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedHistory.length > 0 ? (
              paginatedHistory.map((row) => {
                const { formattedDate, formattedYear } = formatDate(row.transaction_date);
                return (
                  <tr key={row._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-xs md:text-lg truncate">{Number(row.rate).toFixed(2)}</td>
                    <td className="px-4 py-2 text-xs md:text-lg truncate">{row.amount}</td>
                    <td className="px-4 py-2 text-xs md:text-lg truncate">{`${row.from.toUpperCase()}${row.to.toUpperCase()}`}</td>
                    <td className="px-4 py-2 text-xs md:text-lg text-center">
                      <div className="flex flex-col items-center">
                        <span className="hidden md:flex">{formattedDate}/{formattedYear}</span>
                        <span className="md:hidden">{formattedDate}/</span>
                        <span className="md:hidden">{formattedYear}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b hover:bg-gray-100">
                <td colSpan={4} className="px-4 py-2 text-xs text-center">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {location == "/history"? 
        <div className="flex justify-center items-center mt-4">
          <Btn
            label="Back"
            color={`${currentPage === 1? "gray-400" : "white"}`}
            w="w-fit"
            classname={`rounded-r border text-lg`}
            func={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disable={currentPage === 1}
          />
          <span className="px-3">
            Page {currentPage} of {Math.ceil(sortHistory.length / itemsPerPage) || 1}
          </span>
          <Btn
            label="Next"
            color={`${currentPage >= Math.ceil(sortHistory.length / itemsPerPage)   ? "gray-400" : "white"}`}
            w="w-fit"
            classname="rounded-l border text-lg"
            func={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(sortHistory.length / itemsPerPage))
              )
            }
            disable={currentPage >= Math.ceil(sortHistory.length / itemsPerPage)}
          />
        </div>: <></>}
      </div>
    </div>
  );
}

export default TransactionHistory;
