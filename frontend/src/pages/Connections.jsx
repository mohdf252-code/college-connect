import { useEffect, useState } from "react";
import { getConnections } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Connections() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);

  const loadConnections = async () => {
    try {
      const res = await getConnections();
      setConnections(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-10">
      <h1 className="text-4xl text-white font-bold mb-8">
        My Connections
      </h1>

      {connections.length === 0 ? (
        <p className="text-gray-400">
          No connections yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((user) => (
            <div
              key={user._id}
              className="bg-slate-900 rounded-xl p-6 border border-slate-800"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-white text-xl mt-4">
                {user.name}
              </h2>

              <p className="text-gray-400">
                {user.branch || "No Branch"}
              </p>

              <p className="text-gray-400">
                {user.year || ""}
              </p>
              <button
                onClick={() => navigate(`/chat/${user._id}`)}
                className="mt-5 w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-white"
              >
                Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Connections;
