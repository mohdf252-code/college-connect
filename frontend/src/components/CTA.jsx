import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-indigo-700 py-24">
      <div className="max-w-5xl mx-auto text-center px-6">
        <h2 className="text-5xl font-bold text-white">
          Ready to Connect?
        </h2>

        <p className="text-blue-100 mt-6 text-xl">
          Join your campus community and start building meaningful connections today.
        </p>

        <Link to="/signup">
          <button className="mt-10 bg-white text-blue-700 font-semibold px-8 py-4 rounded-xl hover:scale-105 transition">
            Get Started
          </button>
        </Link>
      </div>
    </section>
  );
}

export default CTA;