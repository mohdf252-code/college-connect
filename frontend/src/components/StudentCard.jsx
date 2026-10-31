import { useState } from "react";
import toast from "react-hot-toast";
import { connectUser } from "../services/userService";

function StudentCard({ user, refresh }) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const connect = async () => {
    try {
      setLoading(true);

      const res = await connectUser(user._id);

      toast.success(res.data.message);

      setConnected(true);

      if (refresh) refresh();

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition duration-300">

      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
        {user.name.charAt(0).toUpperCase()}
      </div>

      {/* Name */}
      <h2 className="text-2xl text-white font-bold mt-5">
        {user.name}
      </h2>

      {/* Branch */}
      <p className="text-blue-400 mt-2">
        {user.branch || "Branch not added"}
      </p>

      {/* Year */}
      <p className="text-gray-400">
        {user.year || "Year not added"}
      </p>

      {/* Bio */}
      <p className="text-gray-300 mt-4 text-sm">
        {user.bio || "No bio added yet."}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-5">
        {user.skills?.length > 0 ? (
          user.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-700 text-white text-xs px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">
            No skills added
          </span>
        )}
      </div>

      {/* Interests */}
      <div className="flex flex-wrap gap-2 mt-3">
        {user.interests?.length > 0 ? (
          user.interests.map((interest, index) => (
            <span
              key={index}
              className="bg-slate-700 text-gray-200 text-xs px-3 py-1 rounded-full"
            >
              {interest}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">
            No interests added
          </span>
        )}
      </div>

      {/* Connect Button */}
      <button
        onClick={connect}
        disabled={loading || connected}
        className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
          connected
            ? "bg-green-600 cursor-not-allowed"
            : loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading
          ? "Sending..."
          : connected
          ? "Request Sent ✓"
          : "Connect"}
      </button>

    </div>
  );
}

export default StudentCard;
