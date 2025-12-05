import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";  
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeSalary from "./pages/EmployeeSalary";

function App() {
  return (
    <Router>
      {/* Navbar*/}
      <Navbar />
      
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Employee dashboard */}
        <Route path="/employee" element={<EmployeeDashboard />} />
         {/* Employee salary pdf download */}
        <Route path="/employee/salary" element={<EmployeeSalary />} />

        {/* Redirect "/" to login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
