import {
  FaUserFriends,
  FaComments,
  FaBookOpen,
  FaUsers,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUserFriends size={35} />,
    title: "Connect with Students",
    description:
      "Discover classmates, seniors, and juniors with shared interests, skills, and goals.",
  },
  {
    icon: <FaComments size={35} />,
    title: "Real-Time Chat",
    description:
      "Chat instantly with your college friends and collaborate without leaving the platform.",
  },
  {
    icon: <FaBookOpen size={35} />,
    title: "Share Notes",
    description:
      "Upload and access notes, study resources, and important academic materials.",
  },
  {
    icon: <FaUsers size={35} />,
    title: "Project Collaboration",
    description:
      "Find teammates for hackathons, assignments, and innovative projects.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="bg-slate-950 py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-white">
            Why Choose{" "}
            <span className="text-blue-500">
              College Connect?
            </span>
          </h2>

          <p className="text-gray-400 mt-5 text-lg">
            Everything a student needs to connect, collaborate,
            and succeed—all in one platform.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-8 transition duration-300 hover:-translate-y-3 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="text-blue-500 mb-6 group-hover:scale-110 transition">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;