import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getRequests,
  acceptRequest,
} from "../services/userService";

function Requests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const res = await getRequests();
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const accept = async (id) => {
    try {
      const res = await acceptRequest(id);

      toast.success(res.data.message);

      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-10">
      <h1 className="text-4xl text-white font-bold mb-8">
        Connection Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-400">
          No pending requests
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((user) => (
            <div
              key={user._id}
              className="bg-slate-900 p-5 rounded-xl flex justify-between items-center"
            >
              <div>
                <h2 className="text-white text-xl">
                  {user.name}
                </h2>

                <p className="text-gray-400">
                  {user.branch}
                </p>
              </div>

              <button
                onClick={() => accept(user._id)}
                className="bg-green-600 px-5 py-2 rounded text-white"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;
