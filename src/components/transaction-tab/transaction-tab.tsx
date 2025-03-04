import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TransactionListTable from "../transaction-list-table/transaction-list-table";

type Transaction = {
  id: string;
  category?: string;
  notes?: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  userId?: string;
};

interface TransactionTabProps {
  transactions: Transaction[];
  handleDeleteTransaction: (id: string, date: string) => void;
}

const TransactionTab: React.FC<TransactionTabProps> = ({
  transactions,
  handleDeleteTransaction,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [exp, setExp] = useState(0);
  const [inc, setInc] = useState(0);

  const currentMonth = format(currentDate, "MMMM yyyy");

  const prevMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
    );
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });
  useEffect(() => {
    const totalInc = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    setInc(totalInc);

    const totalExp = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    setExp(totalExp);
  }, [filteredTransactions]);

  return (
    <div className="transaction-container dark:bg-[#1e1e1e] relative">
      <div className="flex justify-between items-center py-4">
        <button onClick={prevMonth} className="p-2 ">
          <ChevronLeft
            color="white"
            className="dark:stroke-white stroke-gray-800"
            strokeWidth={3}
          />
        </button>
        <h2 className="text-lg font-semibold dark:text-gray-300">
          {currentMonth}
        </h2>
        <button onClick={nextMonth} className="p-2 ">
          <ChevronRight
            color="white"
            className="dark:stroke-white stroke-gray-800"
            strokeWidth={3}
          />
        </button>
      </div>
      <div className="flex justify-around items-center py-2 border-t-2">
        <div className="flex items-center justify-center flex-col gap-1">
          <p className="dark:text-gray-300 text-xs">Income</p>
          <span className="text-blue-400 text-sm md:text-base">
            &#8377; {inc}
          </span>
        </div>
        <div className="flex items-center justify-center flex-col gap-1">
          <p className="dark:text-gray-300 text-xs">Exp.</p>
          <span className="text-red-400 text-sm md:text-base">
            &#8377; {exp}
          </span>
        </div>
        <div className="flex items-center justify-center flex-col gap-1">
          <p className="dark:text-gray-300 text-xs">Total</p>
          <span className="dark:text-gray-400 text-sm md:text-base">
            &#8377; {inc - exp}
          </span>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        Object.entries(
          filteredTransactions.reduce(
            (acc: { [key: string]: Transaction[] }, transaction) => {
              const dateKey = transaction.date;
              if (!acc[dateKey]) acc[dateKey] = [];
              acc[dateKey].push(transaction);
              return acc;
            },
            {}
          )
        ).map(([date, transactions]) => {
          const totalIncome = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
          const totalExpense = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div
              key={date}
              className="transaction-group dark:bg-[#1e1e1e] my-2"
            >
              <div className="transaction-header px-3 border-y-2 border-gray-400 py-3 flex justify-between">
                <h2 className="text-sm text-gray-900 font-semibold dark:text-gray-300">
                  {format(new Date(date), "dd MMM yyyy")}
                </h2>
                <p className="space-x-4 text-sm">
                  <span className="text-blue-400">
                    &#8377; {totalIncome.toFixed(2)}
                  </span>{" "}
                  <span className="text-red-400">
                    &#8377; {totalExpense.toFixed(2)}
                  </span>
                </p>
              </div>
              <TransactionListTable
                transactions={transactions}
                onDelete={(id) => handleDeleteTransaction(id, date)}
              />
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">
          No transactions for this month.
        </p>
      )}
    </div>
  );
};

export default TransactionTab;
