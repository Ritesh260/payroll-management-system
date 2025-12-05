import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // ------------------ FETCH NOTIFICATIONS ------------------
  useEffect(() => {
  const getNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  getNotifications();
}, []);

  // ------------------ TOGGLE DROPDOWN & MARK AS READ ------------------
  const handleDropdownToggle = async () => {
    setShowDropdown(!showDropdown);

    // Agar dropdown khula hai aur unread notifications hain, mark all as read
    if (!showDropdown && notifications.some(n => !n.read)) {
      try {
        await axios.put(
          "http://localhost:5000/notifications/read-all",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Frontend me bhi read update karo
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (err) {
        console.error("Error marking notifications as read:", err);
      }
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      {/* LOGO / TITLE */}
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate(role === "admin" ? "/admin" : "/employee")}
      >
        Payroll System (Fullstack-intern)
      </div>

      {/* NAV BUTTONS */}
      <div className="flex gap-6 items-center">
        {/* EMPLOYEE NOTIFICATIONS */}
        {role === "employee" && (
          <div className="relative">
            <button
              onClick={handleDropdownToggle}
              className="hover:text-gray-200 transition relative"
            >
              🔔
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg max-h-80 overflow-y-auto z-50">
                {notifications.length === 0 && (
                  <div className="p-2 text-gray-500">No notifications</div>
                )}
                {notifications.map(n => (
                  <div
                    key={n._id}
                    className={`p-2 border-b ${!n.read ? "font-bold" : ""}`}
                  >
                    {n.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DASHBOARD BUTTON */}
        {role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="hover:text-gray-200 transition"
          >
            Dashboard
          </button>
        )}
        {role === "employee" && (
  <>
    <button
      onClick={() => navigate("/employee")}
      className="hover:text-gray-200 transition"
    >
      Dashboard
    </button>

    <button
      onClick={() => navigate("/employee/salary")}
      className="hover:text-gray-200 transition"
    >
      Salary Slips
    </button>
  </>
)}


        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
