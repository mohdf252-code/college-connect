import {
  FaUserFriends,
  FaComments,
  FaBook,
  FaProjectDiagram,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/userService";

const cardDefinitions = [
  {
    title: "Connections",
    stat: "connections",
    value: 0,
    icon: <FaUserFriends size={28} />,
    route: "/connections",
  },
  {
    title: "Messages",
    stat: "messages",
    value: 0,
    icon: <FaComments size={28} />,
    route: "/chat",
  },
  {
    title: "Notes",
    stat: "notes",
    value: 0,
    icon: <FaBook size={28} />,
    route: "/notes",
  },
  {
    title: "Projects",
    stat: "projects",
    value: 0,
    icon: <FaProjectDiagram size={28} />,
    route: "/discover",
    state: { tab: "hackathons" },
  },
];

function DashboardCards() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ connections: 0, messages: 0, notes: 0, projects: 0 });

  useEffect(() => {
    getDashboardStats().then((response) => setStats(response.data)).catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {cardDefinitions.map((card) => (
        <button
          key={card.title}
          onClick={() => navigate(card.route, card.state ? { state: card.state } : undefined)}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition cursor-pointer text-left w-full group"
        >
          <div className="text-blue-500 group-hover:scale-110 transition duration-200">
            {card.icon}
          </div>

          <h3 className="text-gray-400 mt-4 text-sm font-medium">{card.title}</h3>

          <p className="text-white text-4xl font-bold mt-2">
            {stats[card.stat] ?? card.value}
          </p>
        </button>
      ))}
    </div>
  );
}

export default DashboardCards;
