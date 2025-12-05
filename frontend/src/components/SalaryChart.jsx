import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Line, LineChart, ComposedChart } from "recharts";

export default function SalaryChart({ salaryData, expenseData }) {
  
  // 1️⃣ Combine Salary & Expense by Month
  const chartData = salaryData.map((slip) => {
    const totalExpenses = expenseData
      .filter((exp) => exp.month === slip.month && exp.year === slip.year)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      month: `${slip.month} ${slip.year}`,
      netSalary: slip.netSalary,
      expenses: totalExpenses,
    };
  });

  // If salary slips are empty
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
        No salary data available for charts.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Salary vs Expense Chart</h2>
      
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData}>
          
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Salary Bar */}
          <Bar dataKey="netSalary" name="Net Salary" fill="#4F46E5" radius={[5, 5, 0, 0]} />

          {/* Expense Line */}
          <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
