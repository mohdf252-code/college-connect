 import { Link } from "react-router-dom";
 function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-white">
          College<span className="text-blue-500">Connect</span>
        </h1>

        <div className="hidden md:flex gap-8 text-gray-300">
          <a href="#" className="hover:text-blue-400 transition">Home</a>
          <a href="#features" className="hover:text-blue-400 transition">Features</a>
          <a href="#" className="hover:text-blue-400 transition">About</a>
        </div>

        <div className="flex gap-3">
  <Link to="/login">
    <button className="px-4 py-2 border border-blue-500 rounded-lg text-blue-400 hover:bg-blue-500 hover:text-white transition">
      Login
    </button>
  </Link>

  <Link to="/signup">
    <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition">
      Sign Up
    </button>
  </Link>
</div>

      </div>
    </nav>
  );
}

export default Navbar;