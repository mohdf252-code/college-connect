import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { getDiscoverUsers, connectUser } from "../services/userService";
import { getProjects, createProject, deleteProject } from "../services/projectService";
import StudentCard from "../components/StudentCard";

function Discover() {
  const navigate = useNavigate();
  const location = useLocation();
  const me = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState(location.state?.tab || "students"); // "students" | "hackathons"
  const [users, setUsers] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: "",
    hackathonName: "",
    description: "",
    skillsRequired: "",
  });
  const [postingProject, setPostingProject] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await getDiscoverUsers();
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadProjects();
  }, []);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const handlePostProject = async (e) => {
    e.preventDefault();
    try {
      setPostingProject(true);
      await createProject(projectForm);
      toast.success("Hackathon partner opening posted!");
      setProjectForm({
        title: "",
        hackathonName: "",
        description: "",
        skillsRequired: "",
      });
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not post project");
    } finally {
      setPostingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      toast.success("Project opening removed");
      setProjects((current) => current.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete project");
    }
  };

  const handleConnectWithLeader = async (leaderId) => {
    try {
      const res = await connectUser(leaderId);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send connection request");
    }
  };

  // Filter students based on search term
  const filteredUsers = users.filter((user) => {
    const query = studentSearch.toLowerCase();
    const matchesName = user.name?.toLowerCase().includes(query);
    const matchesBranch = user.branch?.toLowerCase().includes(query);
    const matchesSkills = user.skills?.some((skill) =>
      skill.toLowerCase().includes(query)
    );
    const matchesInterests = user.interests?.some((interest) =>
      interest.toLowerCase().includes(query)
    );
    return matchesName || matchesBranch || matchesSkills || matchesInterests;
  });

  return (
    <div className="min-h-screen bg-slate-950 p-8 md:p-10">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl text-white font-bold">
            Discover & Team Up
          </h1>
          <p className="text-gray-400 mt-2">
            Find teammates for hackathons, study groups, and campus projects.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === "students"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Find Students
          </button>
          <button
            onClick={() => setActiveTab("hackathons")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === "hackathons"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Hackathon Teams ({projects.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Students */}
      {activeTab === "students" && (
        <div>
          <div className="mb-8">
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search by skill (e.g. React, Python), name, or branch..."
              className="w-full max-w-xl p-3 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <StudentCard
                key={user._id}
                user={user}
                refresh={loadUsers}
              />
            ))}
          </div>

          {!filteredUsers.length && (
            <p className="text-gray-400 mt-8">
              {studentSearch ? "No students found matching your search criteria." : "No students discovered yet."}
            </p>
          )}
        </div>
      )}

      {/* Tab 2: Hackathon Openings */}
      {activeTab === "hackathons" && (
        <div className="space-y-8">
          {/* Post Hackathon Team Form */}
          <form
            onSubmit={handlePostProject}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-white">Post a Hackathon / Project Partner Opening</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="Project title (e.g. AI Attendance System)"
                className="p-3 rounded-lg bg-slate-800 text-white outline-none"
              />
              <input
                value={projectForm.hackathonName}
                onChange={(e) => setProjectForm({ ...projectForm, hackathonName: e.target.value })}
                placeholder="Hackathon Name (e.g. Smart India Hackathon, MLH)"
                className="p-3 rounded-lg bg-slate-800 text-white outline-none"
              />
            </div>
            <textarea
              required
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              placeholder="Describe what you are building and what kind of teammate you are looking for..."
              rows="3"
              className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none resize-y"
            />
            <input
              value={projectForm.skillsRequired}
              onChange={(e) => setProjectForm({ ...projectForm, skillsRequired: e.target.value })}
              placeholder="Required skills separated by comma (e.g. React, Node.js, Figma, ML)"
              className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
            />
            <button
              disabled={postingProject}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 py-3 px-6 rounded-lg text-white font-semibold"
            >
              {postingProject ? "Posting..." : "Post Hackathon Opening"}
            </button>
          </form>

          {/* List of Hackathon Openings */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const isOwn = proj.author?._id === (me?._id || me?.id);
              return (
                <div
                  key={proj._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500 transition duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-blue-900/60 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
                        {proj.hackathonName || "Hackathon Project"}
                      </span>
                      {isOwn && (
                        <button
                          onClick={() => handleDeleteProject(proj._id)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-white mt-3">
                      {proj.title}
                    </h2>

                    <p className="text-gray-300 text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                      {proj.description}
                    </p>

                    {/* Skills Required */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {proj.skillsRequired?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-slate-800 text-gray-300 text-xs px-2.5 py-1 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <p className="text-gray-400 text-xs">
                      Posted by <span className="text-white font-semibold">{proj.author?.name}</span> ({proj.author?.branch || "Student"})
                    </p>

                    {!isOwn && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleConnectWithLeader(proj.author?._id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white text-sm font-semibold transition"
                        >
                          Connect
                        </button>
                        <button
                          onClick={() => navigate(`/chat/${proj.author?._id}`)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-white text-sm font-semibold transition"
                        >
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!projects.length && (
            <p className="text-gray-400 mt-8">
              No hackathon openings posted yet. Be the first to post your team request above!
            </p>
          )}
        </div>
      )}

    </div>
  );
}

export default Discover;
