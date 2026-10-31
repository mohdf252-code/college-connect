import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMe, updateProfile } from "../services/userService";

function Profile() {
  const [form, setForm] = useState({
    branch: "", year: "", bio: "", skills: "", interests: "",
  });

  useEffect(() => {
    getMe().then(({ data }) => setForm({
      branch: data.branch || "", year: data.year || "", bio: data.bio || "",
      skills: (data.skills || []).join(", "), interests: (data.interests || []).join(", "),
    })).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await updateProfile({
        ...form,
        skills: form.skills
          .split(",")
          .map((item) => item.trim()),

        interests: form.interests
          .split(",")
          .map((item) => item.trim()),
      });

      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...response.data.user }));
      toast.success("Profile Updated Successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center p-8">

      <form
        onSubmit={saveProfile}
        className="bg-slate-900 p-8 rounded-2xl w-full max-w-xl"
      >
        <h1 className="text-3xl text-white font-bold mb-8">
          Complete Profile
        </h1>

        <input
          name="branch"
          placeholder="Branch"
          value={form.branch}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
        />

        <input
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
        />

        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
        />

        <input
          name="interests"
          placeholder="Interests (comma separated)"
          value={form.interests}
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded bg-slate-800 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold"
        >
          Save Profile
        </button>

      </form>

    </div>
  );
}

export default Profile;
