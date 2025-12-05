import { useState, useEffect } from "react";
import axios from "axios";

export default function EmployeeSalary() {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // -----------------------------
  // Fetch logged-in employee slips
  // -----------------------------
  const fetchMySlips = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/salary/my-slips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlips(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching slips:", err);
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySlips();
  }, []);

  // -----------------------------
  // Download PDF
  // -----------------------------
  const handleDownloadPDF = async (slipId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/salary/${slipId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // important for PDF
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `SalarySlip-${slipId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert(err.response?.data?.message || "Failed to download PDF");
    }
  };

  if (loading) return <div className="p-4">Loading salary slips...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Salary Slips</h2>

      {slips.length === 0 ? (
        <div>No salary slips found.</div>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Month</th>
              <th className="px-4 py-2 border">Year</th>
              <th className="px-4 py-2 border">Net Salary</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slips.map((slip) => (
              <tr key={slip._id} className="text-center">
                <td className="px-4 py-2 border">{slip.month}</td>
                <td className="px-4 py-2 border">{slip.year}</td>
                <td className="px-4 py-2 border">{slip.netSalary}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDownloadPDF(slip._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
