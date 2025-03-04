import { Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type Transaction = {
  id: string;
  category?: string;
  notes?: string;
  amount: number;
  type: "income" | "expense";
  date: string; // Ensure date is in YYYY-MM-DD format
};

interface TransactionListTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionListTable: React.FC<TransactionListTableProps> = ({
  transactions,
  onDelete,
}) => {
  const navigate = useNavigate();
  const handleDelete = (id: string) => {
    // Call the onDelete function passed from the parent component
    onDelete(id);
  };
  return (
    <ul>
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          className={`transaction-item hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer py-2 border-b px-3 flex justify-between items-center dark:text-gray-300 ${transaction.type}`}
          onClick={() => navigate(`/add-transaction/${transaction.id}`)}
        >
          <div className="flex gap-5 justify-center items-center">
            <div className="w-20 text-sm truncate overflow-hidden whitespace-nowrap dark:text-gray-500">
              {transaction.category}
            </div>
            <div>
              <div className="text-sm">{transaction.notes || "No notes"}</div>
              <div className="text-xs dark:text-gray-500">
                {transaction.notes || "No notes"}
              </div>
            </div>
          </div>
          <div className="flex gap-3 md:gap-11 justify-center items-center">
            <div
              className={`text-sm ${
                transaction.type === "expense"
                  ? "text-red-400"
                  : "text-blue-400"
              }`}
            >
              ₹ {transaction.amount.toFixed(2)}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent list item click from triggering
                handleDelete(transaction.id);
              }}
            >
              <Trash2 color="gray" className="hover:stroke-red-400" size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TransactionListTable;
