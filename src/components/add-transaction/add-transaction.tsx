import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../../utils/auth-context";
import { Transaction } from "../../utils/types";
import { useForm } from "react-hook-form";
import "./add-transaction.css";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddTransactionForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<Transaction>({
    defaultValues: {
      type: "expense", // Default to "expense"
      date: new Date().toISOString().split("T")[0], // Default to today
    },
  });

  const [type, setType] = useState<"expense" | "income">("expense");
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const categoryInputRef = useRef<HTMLDivElement>(null);
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesRef = collection(db, "categories");
      const querySnapshot = await getDocs(categoriesRef);

      const fetchedIncomeCategories: string[] = [];
      const fetchedExpenseCategories: string[] = [];

      querySnapshot.forEach((doc) => {
        const category = doc.data();
        if (category.type === "income") {
          fetchedIncomeCategories.push(category.name);
        } else if (category.type === "expense") {
          fetchedExpenseCategories.push(category.name);
        }
      });

      setIncomeCategories(fetchedIncomeCategories);
      setExpenseCategories(fetchedExpenseCategories);
    };

    fetchCategories();
  }, []);

  const handleTransactionSubmit = async (transactionData: Transaction) => {
    const { type, amount, category, date, notes } = transactionData;
    if (!user) return alert("You need to log in first");

    try {
      const parsedAmount = parseFloat(amount.toString());
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return toast.error("Please enter a valid amount");
      }
      await addDoc(collection(db, `users/${user.uid}/transactions`), {
        type,
        amount: parsedAmount,
        category,
        date,
        notes,
        userId: user.uid,
      });
      toast.success("Transaction added!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleTypeChange = (newType: "expense" | "income") => {
    setType(newType);
    setValue("type", newType); // Update the form value
  };

  const handleSelectCategory = (category: string) => {
    setValue("category", category);
    setShowCategoryList(false); // Close the dropdown after selection
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory,
        userId: user?.uid,
        type,
      });
      if (type === "income") {
        setIncomeCategories([...incomeCategories, newCategory]);
      } else {
        setExpenseCategories([...expenseCategories, newCategory]);
      }

      setNewCategory("");
      setAddingCategory(false);
      setValue("category", newCategory); // Set new category in the form field
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target as Node)
      ) {
        setShowCategoryList(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="transaction-form-section">
      <form
        onSubmit={handleSubmit(handleTransactionSubmit)}
        className="main-form-transaction"
      >
        <div className="transaction-type-toggle border-b-gray-900 flex w-full bg-white dark:bg-slate-700 p-1 rounded-lg">
          {/* Expense Button */}
          <button
            type="button"
            className={`transaction-type-toggle-button ${
              type === "expense" ? "active expense" : ""
            }`}
            onClick={() => handleTypeChange("expense")}
          >
            Expense
          </button>

          {/* Income Button */}
          <button
            type="button"
            className={`transaction-type-toggle-button ${
              type === "income" ? "active income" : ""
            }`}
            onClick={() => handleTypeChange("income")}
          >
            Income
          </button>
        </div>

        <div className="transaction-details space-y-10 mt-12">
          <div className="flex gap-3">
            <label className="w-24 text-gray-900 dark:text-gray-400">
              Date
            </label>
            <input
              {...register("date")}
              className={`flex-grow w-full border-b dark:text-white caret-transparent rounded-none dark:bg-transparent focus:outline-none ${
                type === "expense"
                  ? "focus:border-red-400"
                  : "focus:border-blue-400"
              }`}
              type="date"
              required
              placeholder=" "
            />
          </div>
          <div className="flex gap-3">
            <label className="w-24 text-gray-900 dark:text-gray-400">
              Amount
            </label>
            <input
              inputMode="decimal"
              type="text"
              {...register("amount")}
              required
              className={`w-full caret-transparent dark:text-white dark:bg-transparent border-b rounded-none focus:outline-none ${
                type === "expense"
                  ? "focus:border-red-400"
                  : "focus:border-blue-400"
              }`}
            />
          </div>
          <div className="flex gap-3">
            <label className=" w-24 text-gray-900 dark:text-gray-400">
              Category
            </label>
            <div className="relative w-full" ref={categoryInputRef}>
              <input
                {...register("category")}
                type="text"
                readOnly
                required
                onClick={() => setShowCategoryList(true)}
                className={`w-full caret-transparent dark:text-white dark:bg-transparent rounded-none border-b focus:outline-none ${
                  type === "expense"
                    ? "focus:border-red-400"
                    : "focus:border-blue-400"
                }`}
                placeholder="Select Category"
              />

              {/* Show relevant category list based on type */}
              {showCategoryList && (
                <div className="absolute z-10 w-full mt-2 gap-2 grid grid-cols-2 md:grid-cols-3 bg-white dark:bg-slate-700 border rounded-lg shadow-lg divide-x divide-y divide-gray-300 dark:divide-gray-600">
                  {type === "income"
                    ? incomeCategories.map((category, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectCategory(category)}
                          className="p-2 text-gray-900 text-center dark:text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {category}
                        </div>
                      ))
                    : expenseCategories.map((category, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectCategory(category)}
                          className="p-2 text-gray-900 text-center dark:text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {category}
                        </div>
                      ))}

                  {/* Add new category */}
                  <div
                    className="p-2  cursor-pointer  hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 text-center dark:text-gray-400"
                    onClick={() => setAddingCategory(true)}
                  >
                    + Add
                  </div>
                </div>
              )}

              {/* Add Category Input */}
              {addingCategory && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-700 border rounded-lg shadow-lg p-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none"
                  />
                  <div className="flex gap-3 mt-5">
                    <button
                      type="button"
                      className={`text-white  px-4 py-2 rounded-lg ${
                        type === "expense" ? "bg-red-400" : "bg-blue-400"
                      }`}
                      onClick={handleAddCategory}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="text-white bg-gray-600 px-4 py-2 rounded-lg"
                      onClick={() => setAddingCategory(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <label className="w-24 text-gray-900 dark:text-gray-400">
              Notes
            </label>
            <input
              {...register("notes")}
              className={`w-full border-b dark:text-white dark:bg-transparent rounded-none focus:outline-none ${
                type === "expense"
                  ? "focus:border-red-400"
                  : "focus:border-blue-400"
              }`}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`text-white  px-4 py-2 mt-10 w-full rounded-lg ${
            type === "expense" ? "bg-red-400" : "bg-blue-400"
          }`}
        >
          Add
        </button>
      </form>
    </section>
  );
};

export default AddTransactionForm;
