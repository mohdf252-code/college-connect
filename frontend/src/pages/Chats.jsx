import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getConversations } from "../services/messageService";
import { getConnections } from "../services/userService";

function Chats() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    Promise.all([getConversations(), getConnections()])
      .then(([chatResponse, connectionResponse]) => {
        setConversations(chatResponse.data);
        setConnections(connectionResponse.data);
      })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load chats"));
  }, []);

  const started = new Set(conversations.map((conversation) => conversation.user._id));

  return (
    <div className="min-h-screen bg-slate-950 p-8 md:p-10">
      <h1 className="text-4xl text-white font-bold">Messages & Doubts</h1>
      <p className="text-gray-400 mt-2">Campus discussions, doubts, and your personal connections.</p>

      <div className="max-w-3xl mt-8 space-y-4">
        {/* Campus Doubt & Chitchat Room */}
        <button
          onClick={() => navigate("/chat/community")}
          className="w-full bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/50 hover:border-blue-500 rounded-xl p-4 text-left flex items-center gap-4 transition shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
            💬
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-bold">Campus Doubts & Chitchat Lounge</h2>
              <span className="bg-blue-600/30 text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Public Room
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Ask academic doubts, talk about hackathons, or just chitchat with all campus students!
            </p>
          </div>
        </button>

        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 pt-4">Direct Messages</h3>

        {conversations.map(({ user, lastMessage }) => (
          <button
            key={user._id}
            onClick={() => navigate(`/chat/${user._id}`)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl p-4 text-left flex items-center gap-4 transition"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-3">
                <h2 className="text-white font-semibold">{user.name}</h2>
                <span className="text-gray-500 text-xs whitespace-nowrap">
                  {new Date(lastMessage.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-400 truncate mt-1">
                {lastMessage.sender === user._id ? user.name : "You"}: {lastMessage.text}
              </p>
            </div>
          </button>
        ))}

        {connections.filter((user) => !started.has(user._id)).map((user) => (
          <button
            key={user._id}
            onClick={() => navigate(`/chat/${user._id}`)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl p-4 text-left flex items-center gap-4 transition"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-semibold">{user.name}</h2>
              <p className="text-gray-400 mt-1">Start a conversation</p>
            </div>
          </button>
        ))}
      </div>

      {!conversations.length && !connections.length && (
        <p className="text-gray-400 mt-8">Connect with students on the Discover page to start private messaging.</p>
      )}
    </div>
  );
}

export default Chats;
