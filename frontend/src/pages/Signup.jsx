import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); // "form" | "otp"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
  });
  const [otp, setOtp] = useState("");
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

  // Step 1: Send OTP to College Email
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.college.trim()) {
      return toast.error("Please fill in all details");
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", {
        email: formData.email.trim(),
      });

      toast.success(res.data.message || "Verification code sent to your email!");
      setStep("otp");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send verification code"));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return toast.error("Please enter the 6-digit verification code");
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        ...formData,
        email: formData.email.trim(),
        otp: otp.trim(),
      });

      toast.success(res.data.message || "Account verified & created!");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Verification failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", {
        email: formData.email.trim(),
      });
      toast.success(res.data.message || "New code sent!");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not resend code"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">

        {step === "form" ? (
          <>
            <h1 className="text-4xl font-bold text-white text-center">
              Create Account
            </h1>

            <p className="text-gray-400 text-center mt-2">
              Join your official college community.
            </p>

            <form onSubmit={handleSendOtp} className="mt-8 space-y-5">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:border-blue-500 outline-none"
              />

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Official College Email (e.g. .edu, .ac.in)"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1.5 ml-1">
                  Must be your institutional email (e.g. name@college.edu or .ac.in)
                </p>
              </div>

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
                {loading ? "Sending Verification Code..." : "Continue & Verify Email"}
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
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white text-center">
              Verify College Email
            </h1>

            <p className="text-gray-400 text-center mt-2 text-sm">
              We sent a 6-digit code to <br />
              <span className="text-blue-400 font-medium">{formData.email}</span>
            </p>

            <form onSubmit={handleVerifyAndRegister} className="mt-8 space-y-5">

              <div>
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:border-blue-500 outline-none text-center tracking-widest text-2xl font-bold font-mono"
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Code expires in 10 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white py-4 rounded-xl font-semibold transition cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>

              <div className="flex justify-between items-center text-sm pt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  Change Email / Back
                </button>
              </div>

            </form>
          </>
        )}

      </div>

    </div>
  );
}

export default Signup;
