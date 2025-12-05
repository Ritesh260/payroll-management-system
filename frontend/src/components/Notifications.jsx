import { useEffect, useState } from "react";
import API from "../services/api";

export default function Notifications() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    API.get("/notifications")
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold text-xl mb-3">Notifications</h2>

      {notes.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      {notes.map((n) => (
        <div
          key={n._id}
          className={`p-2 mb-2 border rounded ${
            n.read ? "bg-gray-100" : "bg-blue-50"
          }`}
        >
          <p>{n.message}</p>
          <small className="text-gray-600">
            {new Date(n.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
