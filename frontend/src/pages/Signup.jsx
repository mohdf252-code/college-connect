import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper to extract clear error message
  const getErrorMessage = (err, fallback) => {
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.status === 404) {
      return "Backend route not found (404). Please ensure your deployed backend has the latest code pushed!";
    }
    if (err.code === "ERR_NETWORK") {
      return "Network error: Cannot reach the backend server. Is it running or sleeping?";
    }
    return err.message || fallback;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.college.trim()) {
      return toast.error("Please fill in all details");
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        ...formData,
        email: formData.email.trim(),
      });

      toast.success(res.data.message || "Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">

        <h1 className="text-4xl font-bold text-white text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Join your college community.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:border-blue-500 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:border-blue-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:border-blue-500 outline-none"
          />

          <input
            type="text"
            name="college"
            placeholder="College Name"
            required
            value={formData.college}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:border-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white py-4 rounded-xl font-semibold transition cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline"
          >
            Log In
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;
