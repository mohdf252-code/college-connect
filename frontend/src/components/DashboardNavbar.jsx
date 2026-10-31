import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function DashboardNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate("/discover");
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center">

      <Link to="/dashboard">
        <h1 className="text-2xl font-bold text-white cursor-pointer">
          College<span className="text-blue-500">Connect</span>
        </h1>
      </Link>

      <div className="flex items-center gap-4">

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search students or skills (Enter)..."
          className="bg-slate-800 text-white px-4 py-2 rounded-lg outline-none w-72 focus:border focus:border-blue-500 text-sm"
        />

        <div className="text-white font-semibold">
          👋 {user?.name || "Student"}
        </div>

      </div>

    </header>
  );
}

export default DashboardNavbar;
