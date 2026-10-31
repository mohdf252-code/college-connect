import {
  FaHome,
  FaComments,
  FaBook,
  FaUserFriends,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const items = [
  { icon: <FaHome />, label: "Dashboard", to: "/dashboard" },
  { icon: <FaComments />, label: "Messages", to: "/chat" },
  { icon: <FaBook />, label: "Notes", to: "/notes" },
  { icon: <FaUserFriends />, label: "Connections", to: "/connections" },
  { icon: <FaCog />, label: "Settings", to: "/profile" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between min-h-[calc(100vh-73px)]">

      <div className="space-y-5">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `flex items-center gap-4 hover:text-blue-400 cursor-pointer ${isActive ? "text-blue-400" : "text-gray-300"}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-gray-400 hover:text-red-400 cursor-pointer transition w-full"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
