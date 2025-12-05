import { useEffect, useState } from "react";
import axios from "axios";
import SalaryChart from "../components/SalaryChart";

/* -------------------- CHART IMPORTS --------------------- */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
/* --------------------------------------------------------- */

export default function AdminDashboard() {
  const [salarySlips, setSalarySlips] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employee: "",
    month: "",
    year: "",
    basic: "",
    hra: "",
    allowances: "",
    deductions: "",
    netSalary: "",
  });

  const token = localStorage.getItem("token");

  // Fetch salary slips
  const fetchSalarySlips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/salary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalarySlips(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching salary slips");
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    }
  };

  useEffect(() => {
    fetchSalarySlips();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CREATE or UPDATE Salary Slip
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/salary/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/salary", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Created successfully!");
      }

      setEditingId(null);
      setFormData({
        employee: "",
        month: "",
        year: "",
        basic: "",
        hra: "",
        allowances: "",
        deductions: "",
        netSalary: "",
      });

      fetchSalarySlips();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error");
    }
  };

  const handleEdit = (slip) => {
    setEditingId(slip._id);
    setFormData({
      employee: slip.employee?._id || slip.employee,
      month: slip.month,
      year: slip.year,
      basic: slip.basic,
      hra: slip.hra,
      allowances: slip.allowances,
      deductions: slip.deductions,
      netSalary: slip.netSalary,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------- DELETE SALARY SLIP --------------------
  const handleDelete = async (slipId) => {
    if (!window.confirm("Are you sure you want to delete this salary slip?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/salary/${slipId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted successfully!");
      fetchSalarySlips();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete salary slip");
    }
  };
  /* ------------------------------------------------------------ */

  /* -------------------- CHART DATA --------------------- */
  const salaryChartData = {
    labels: salarySlips.map((s) => `${s.month} ${s.year}`),
    datasets: [
      {
        label: "Net Salary",
        data: salarySlips.map((s) => s.netSalary),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };
  /* ----------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>

      {/* ------------------ SALARY + EXPENSE CHART ------------------ */}
      <SalaryChart salaryData={salarySlips} expenseData={[]} />

      {/* Salary Slip Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Update Salary Slip" : "Create Salary Slip"}
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          >
            <option value="">Select Employee</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <input type="text" name="month" placeholder="Month" value={formData.month} onChange={handleChange} required className="p-3 border rounded-lg" />
          <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleChange} required className="p-3 border rounded-lg" />
          <input type="number" name="basic" placeholder="Basic" value={formData.basic} onChange={handleChange} required className="p-3 border rounded-lg" />
          <input type="number" name="hra" placeholder="HRA" value={formData.hra} onChange={handleChange} required className="p-3 border rounded-lg" />
          <input type="number" name="allowances" placeholder="Allowances" value={formData.allowances} onChange={handleChange} className="p-3 border rounded-lg" />
          <input type="number" name="deductions" placeholder="Deductions" value={formData.deductions} onChange={handleChange} className="p-3 border rounded-lg" />
          <input type="number" name="netSalary" placeholder="Net Salary" value={formData.netSalary} onChange={handleChange} required className="p-3 border rounded-lg" />

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 text-white py-3 rounded-lg"
          >
            {editingId ? "Update Salary Slip" : "Create Salary Slip"}
          </button>
        </form>
      </div>

      {/* Salary Slips Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">All Salary Slips</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">Employee</th>
                <th className="p-3 border">Month</th>
                <th className="p-3 border">Year</th>
                <th className="p-3 border">Basic</th>
                <th className="p-3 border">HRA</th>
                <th className="p-3 border">Allowances</th>
                <th className="p-3 border">Deductions</th>
                <th className="p-3 border">Net Salary</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salarySlips.map((slip) => (
                <tr key={slip._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{slip.employee?.name || "N/A"}</td>
                  <td className="p-3 border">{slip.month}</td>
                  <td className="p-3 border">{slip.year}</td>
                  <td className="p-3 border">{slip.basic}</td>
                  <td className="p-3 border">{slip.hra}</td>
                  <td className="p-3 border">{slip.allowances}</td>
                  <td className="p-3 border">{slip.deductions}</td>
                  <td className="p-3 border">{slip.netSalary}</td>

                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(slip)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(slip._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
