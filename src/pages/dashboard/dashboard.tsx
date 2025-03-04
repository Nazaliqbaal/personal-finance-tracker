import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useAuth } from "../../utils/auth-context";
import { Transaction } from "../../utils/types";
import TransactionTab from "../../components/transaction-tab/transaction-tab";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import "./dashboard.css";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const navigateToAddTransaction = () => {
    navigate("/add-transaction");
  };
  const [selectedMonth] = useState(new Date().getMonth()); // Default: Current month
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
            .split("T")[0];

          if (!grouped[dateKey]) {
            grouped[dateKey] = {
              transactions: [],
              totalExpense: 0,
              totalIncome: 0,
            };
          }

          grouped[dateKey].transactions.push(transaction);

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
        setGroupedTransactions(Object.fromEntries(sortedEntries));
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [user, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    return Object.values(groupedTransactions).flatMap(
      (group) => group.transactions
    );
  }, [groupedTransactions]);

  const handleDeleteTransaction = async (id: string, dateKey: string) => {
    try {
      await deleteDoc(doc(db, `users/${user?.uid}/transactions`, id));

      setGroupedTransactions((prevGroupedTransactions) => {
        const updatedGroupedTransactions = { ...prevGroupedTransactions };
        const transactionsForDate = updatedGroupedTransactions[dateKey];

        transactionsForDate.transactions =
          transactionsForDate.transactions.filter(
            (transaction) => transaction.id !== id
          );

        transactionsForDate.totalExpense = transactionsForDate.transactions
          .filter((transaction) => transaction.type === "expense")
          .reduce((acc, curr) => acc + parseFloat(curr.amount.toString()), 0);

        transactionsForDate.totalIncome = transactionsForDate.transactions
          .filter((transaction) => transaction.type === "income")
          .reduce((acc, curr) => acc + parseFloat(curr.amount.toString()), 0);

        return updatedGroupedTransactions;
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <section className="transactions-list h-full flex flex-col justify-between font-poppins dark:bg-[#1e1e1e]">
      <TransactionTab
        transactions={filteredTransactions}
        handleDeleteTransaction={handleDeleteTransaction}
      />
      <div className="sm:hidden text-right m-8 flex justify-end">
        <button
          className="cssbuttons-io-button absolute bottom-8"
          onClick={navigateToAddTransaction}
        >
          <Plus />
        </button>
      </div>
    </section>
  );
};

export default DashboardPage;
