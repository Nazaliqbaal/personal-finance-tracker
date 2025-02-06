import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../utils/auth-context";
import { Transaction } from "../../utils/types";

const DashboardPage = () => {
  const { user, theme } = useAuth();
  console.log("theme is", theme);

  const [groupedTransactions, setGroupedTransactions] = useState<
    Record<
      string,
      { transactions: Transaction[]; totalExpense: number; totalIncome: number }
    >
  >({});

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const transactionsRef = collection(
          db,
          `users/${user.uid}/transactions`
        );
        const querySnapshot = await getDocs(transactionsRef);
        const transactions: Transaction[] = [];

        querySnapshot.forEach((doc) => {
          transactions.push({ ...doc.data(), id: doc.id } as Transaction);
        });

        // Process and group transactions
        const grouped: Record<
          string,
          {
            transactions: Transaction[];
            totalExpense: number;
            totalIncome: number;
          }
        > = {};

        transactions.forEach((transaction) => {
          const dateKey = new Date(transaction.date)
            .toISOString()
            .split("T")[0]; // Format as YYYY-MM-DD

          if (!grouped[dateKey]) {
            grouped[dateKey] = {
              transactions: [],
              totalExpense: 0,
              totalIncome: 0,
            };
          }

          grouped[dateKey].transactions.push(transaction);

          // Calculate total expense and income
          if (transaction.type === "expense") {
            grouped[dateKey].totalExpense += parseFloat(
              transaction.amount.toString()
            );
          } else {
            grouped[dateKey].totalIncome += parseFloat(
              transaction.amount.toString()
            );
          }
        });

        // Sort dates in descending order
        const sortedEntries = Object.entries(grouped).sort(
          ([dateA], [dateB]) =>
            new Date(dateB).getTime() - new Date(dateA).getTime()
        );
        const sortedGroupedTransactions = Object.fromEntries(sortedEntries);

        setGroupedTransactions(sortedGroupedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options); // Example: "Monday, 29"
  };

  return (
    <section className="transactions-list font-poppins mt-6 dark:bg-gray-800 ">
      {Object.entries(groupedTransactions).map(
        ([date, { transactions, totalExpense, totalIncome }]) => (
          <div key={date} className="transaction-group dark:bg-[#1e1e1e] my-2 ">
            <div className="transaction-header px-3 border-y-2 border-gray-400 py-3 flex justify-between">
              <h2 className="text-sm text-gray-900 font-bold  dark:text-gray-300">
                {formatDate(date)}
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
            <ul>
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className={`transaction-item py-2 border-b px-3 flex justify-between items-center dark:text-gray-300 ${transaction.type}`}
                >
                  <div className="flex gap-5 justify-center items-center ">
                    <div className="w-28 text-sm truncate overflow-hidden whitespace-nowrap dark:text-gray-500 ">
                      {transaction.category}
                    </div>
                    <div>
                      <div className="text-sm">
                        {transaction.notes || "No notes"}
                      </div>
                      <div className="text-xs dark:text-gray-500">
                        {transaction.notes || "No notes"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm ${
                      transaction.type === "expense"
                        ? "text-red-400"
                        : "text-blue-400"
                    }`}
                  >
                    {transaction.type === "expense"
                      ? ` ₹ ${transaction.amount}`
                      : ` ₹ ${transaction.amount}`}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </section>
  );
};

export default DashboardPage;
