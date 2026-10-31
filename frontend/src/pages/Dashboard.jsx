import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import QuickActions from "../components/QuickActions";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-slate-950">

      <DashboardNavbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8">

          <h1 className="text-4xl font-bold text-white">
            Welcome back, {user?.name} 👋
          </h1>

          <p className="text-gray-400 mt-2">
            Connect, collaborate and grow with your college community.
          </p>

          <DashboardCards />

          <QuickActions />

        </main>

      </div>

    </div>
  );
}

export default Dashboard;