import { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, Clock } from "lucide-react";

type TransactionType = "Deposit" | "Withdraw" | "Transfer" | "Funding Deal";
type TransactionStatus = "Success" | "Pending" | "Failed";

type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  sender: string;
  receiver: string;
  status: TransactionStatus;
  date: string;
};

const STATUS_COLOR: Record<TransactionStatus, string> = {
  Success: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed:  "bg-red-100 text-red-700",
};

const TYPE_COLOR: Record<TransactionType, string> = {
  "Deposit":      "text-green-600",
  "Withdraw":     "text-red-600",
  "Transfer":     "text-blue-600",
  "Funding Deal": "text-purple-600",
};

const STORAGE_KEY_BALANCE      = "nexus_wallet_balance";
const STORAGE_KEY_TRANSACTIONS = "nexus_transactions";

function loadBalance(): number {
  const stored = localStorage.getItem(STORAGE_KEY_BALANCE);
  return stored ? Number(stored) : 25000;
}

function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function PaymentsPage() {
  const [balance, setBalance]           = useState<number>(loadBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [amount, setAmount]             = useState("");
  const [filterType, setFilterType]     = useState<TransactionType | "All">("All");
  const [error, setError]               = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BALANCE, String(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (type: TransactionType) => {
    setError("");
    const val = Number(amount);

    if (!val || val <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    if ((type === "Withdraw" || type === "Transfer") && val > balance) {
      setError("Insufficient wallet balance.");
      return;
    }

    const newBalance = type === "Deposit" ? balance + val : balance - val;

    const tx: Transaction = {
      id:       crypto.randomUUID(),
      type,
      amount:   val,
      sender:   type === "Deposit"      ? "External"     : "You",
      receiver: type === "Funding Deal" ? "Entrepreneur" :
                type === "Transfer"     ? "Recipient"    : "Wallet",
      status:   "Success",
      date:     new Date().toLocaleString(),
    };

    setBalance(newBalance);
    setTransactions(prev => [tx, ...prev]);
    setAmount("");
  };


  const totalDeposited = transactions
    .filter(t => t.type === "Deposit" && t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type !== "Deposit" && t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0);

  const filtered =
    filterType === "All"
      ? transactions
      : transactions.filter(t => t.type === filterType);

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

      {/* ── Wallet balance dashboard cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 mb-3 opacity-80">
            <Wallet size={18} />
            <span className="text-sm font-medium">Wallet Balance</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            ${balance.toLocaleString()}
          </p>
          <p className="text-xs mt-2 opacity-60">Available funds</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Deposited</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalDeposited.toLocaleString()}
          </p>
          <p className="text-xs mt-2 text-gray-400">All time</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={18} className="text-red-500" />
            <span className="text-sm font-medium text-gray-600">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalSpent.toLocaleString()}
          </p>
          <p className="text-xs mt-2 text-gray-400">All time</p>
        </div>
      </div>

      {/* ── Transaction form ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-800">New Transaction</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              placeholder="Amount"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError(""); }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {(["Deposit", "Withdraw", "Transfer", "Funding Deal"] as TransactionType[]).map(t => (
              <button
                key={t}
                onClick={() => addTransaction(t)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white
                           rounded-lg text-sm font-medium transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Transaction history table ── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between
                        gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-800">
              Transaction History
            </h2>
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
              {filtered.length}
            </span>
          </div>

          {/* Filter dropdown */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as TransactionType | "All")}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="All">All Types</option>
            {(["Deposit", "Withdraw", "Transfer", "Funding Deal"] as TransactionType[]).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Wallet size={36} className="mb-3 opacity-30" />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Sender</th>
                  <th className="px-5 py-3">Receiver</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className={`px-5 py-3 font-medium ${TYPE_COLOR[tx.type]}`}>
                      {tx.type}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{tx.sender}</td>
                    <td className="px-5 py-3 text-gray-600">{tx.receiver}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block text-xs font-medium
                        px-2.5 py-0.5 rounded-full ${STATUS_COLOR[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}