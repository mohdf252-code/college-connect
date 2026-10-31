import { FaUserPlus, FaUserEdit, FaSearch, FaComments } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus size={28} />,
    title: "Create Account",
    description: "Sign up using your college email and become a verified student.",
  },
  {
    icon: <FaUserEdit size={28} />,
    title: "Complete Profile",
    description: "Add your branch, year, skills, interests, and a short bio.",
  },
  {
    icon: <FaSearch size={28} />,
    title: "Discover Students",
    description: "Search classmates, seniors, clubs, and project partners.",
  },
  {
    icon: <FaComments size={28} />,
    title: "Connect & Chat",
    description: "Start conversations, collaborate on projects, and share notes.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-slate-900 py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white">
            How It <span className="text-blue-500">Works</span>
          </h2>

          <p className="text-gray-400 mt-5 text-lg">
            Get started in just a few simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">

          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center hover:border-blue-500 transition"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>

              <p className="text-gray-400">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;