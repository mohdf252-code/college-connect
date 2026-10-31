import {
  FaBook,
  FaComments,
  FaUsers,
  FaUserEdit,
  FaUserFriends,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Share Notes",
    icon: <FaBook />,
    route: "/notes",
  },
  {
    title: "My Connections",
    icon: <FaUserFriends />,
    route: "/connections",
  },
  {
    title: "Connection Requests",
    icon: <FaUserFriends />,
    route: "/requests",
  },
  {
    title: "Open Chats & Doubts",
    icon: <FaComments />,
    route: "/chat",
  },
  {
    title: "Find Hackathon & Project Partners",
    icon: <FaUsers />,
    route: "/discover",
  },
  {
    title: "Complete Profile",
    icon: <FaUserEdit />,
    route: "/profile",
  },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => {
              navigate(action.route);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left hover:border-blue-500 transition flex items-center gap-4 text-white cursor-pointer"
          >
            <span className="text-blue-500 text-xl">
              {action.icon}
            </span>
            {action.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
