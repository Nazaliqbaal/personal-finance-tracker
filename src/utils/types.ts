type TransactionType = "income" | "expense";

// Transaction interface to model the transaction data
export interface Transaction {
  id: string; // Unique ID for the transaction (could be from Firebase or generated)
  amount: number; // The amount of the transaction
  category: string; // Category for the transaction (e.g., "Groceries", "Salary")
  type: TransactionType; // Type of the transaction ("income" or "expense")
  date: string; // Date of the transaction
  userId?: string; // The userId from Firebase to link the transaction to a user
  notes?: string;
}
