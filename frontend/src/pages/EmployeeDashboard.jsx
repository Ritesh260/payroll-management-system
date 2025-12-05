import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeDashboard() {
  const [salarySlips, setSalarySlips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseData, setExpenseData] = useState({
    month: "",
    year: "",
    amount: "",
    description: "",
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = localStorage.getItem("token");

  // ---------------------------
  // Fetch own salary slips
  // ---------------------------
  const fetchSalarySlips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/salary/my-slips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalarySlips(res.data);
    } catch (err) {
      console.error("Error fetching salary slips:", err);
    }
  };

  // ---------------------------
  // Fetch own expenses
  // ---------------------------
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  // ---------------------------
  // Fetch notifications
  // ---------------------------
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchSalarySlips();
    fetchExpenses();
    fetchNotifications();
  }, []);

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/expense", expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      setExpenseData({ month: "", year: "", amount: "", description: "" });
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error submitting expense");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Employee Dashboard</h1>

      {/* ---------------------------
          Notifications Icon & Dropdown
      --------------------------- */}
      <div className="mb-6 relative">
        <button
          className="text-xl relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute mt-2 w-80 bg-white text-black rounded shadow-lg max-h-80 overflow-y-auto z-50">
            {notifications.length === 0 ? (
              <div className="p-2 text-gray-500">No notifications</div>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  className={`p-2 border-b ${!n.read ? "font-bold" : ""}`}
                >
                  {n.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ---------------------------
          Submit Expense Form
      --------------------------- */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Submit Monthly Expense</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="month"
            placeholder="Month"
            value={expenseData.month}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={expenseData.year}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={expenseData.amount}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={expenseData.description}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Submit Expense
          </button>
        </form>
      </div>

      {/* ---------------------------
          Salary Slips Table
      --------------------------- */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">My Salary Slips</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">Month</th>
                <th className="p-3 border">Year</th>
                <th className="p-3 border">Basic</th>
                <th className="p-3 border">HRA</th>
                <th className="p-3 border">Allowances</th>
                <th className="p-3 border">Deductions</th>
                <th className="p-3 border">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {salarySlips.map(slip => (
                <tr key={slip._id}>
                  <td className="p-3 border">{slip.month}</td>
                  <td className="p-3 border">{slip.year}</td>
                  <td className="p-3 border">{slip.basic}</td>
                  <td className="p-3 border">{slip.hra}</td>
                  <td className="p-3 border">{slip.allowances}</td>
                  <td className="p-3 border">{slip.deductions}</td>
                  <td className="p-3 border">{slip.netSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------
          Expense History Table
      --------------------------- */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Expense History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">Month</th>
                <th className="p-3 border">Year</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp._id}>
                  <td className="p-3 border">{exp.month}</td>
                  <td className="p-3 border">{exp.year}</td>
                  <td className="p-3 border">{exp.amount}</td>
                  <td className="p-3 border">{exp.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
