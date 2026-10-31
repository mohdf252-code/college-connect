const stats = [
  { number: "1000+", label: "Students Connected" },
  { number: "500+", label: "Notes Shared" },
  { number: "120+", label: "Projects Created" },
  { number: "24/7", label: "Real-Time Chat" },
];

function Stats() {
  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500 transition"
            >
              <h2 className="text-4xl font-bold text-blue-500">
                {stat.number}
              </h2>

              <p className="text-gray-300 mt-3">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Stats;