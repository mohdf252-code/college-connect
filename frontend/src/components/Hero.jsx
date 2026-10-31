function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      <div className="text-center max-w-4xl">

        <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight">
          Connect.
          <br />
          Collaborate.
          <br />
          <span className="text-blue-500">Grow.</span>
        </h1>

        <p className="mt-8 text-xl text-gray-300">
          Meet classmates, build friendships, collaborate on projects,
          share notes, and grow together through one exclusive campus platform.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-white font-semibold">
            Get Started
          </button>

          <button className="border border-blue-500 px-8 py-4 rounded-xl text-blue-400 hover:bg-blue-600 hover:text-white transition">
            Learn More
          </button>
        </div>

      </div>

    </section>
  );
}

export default Hero;