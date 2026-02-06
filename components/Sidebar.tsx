
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    router.push("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-emerald-950 text-emerald-100 flex flex-col">
      {/* Logo / Title */}
      <div className="px-6 py-5 text-xl font-semibold text-white border-b border-slate-900">
        Admin Panel
      </div>
      

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <button
         onClick={() => router.push("/dashboard")}
          className="w-full text-left px-4 py-2 rounded-md bg-emerald-900 text-white hover:bg-emerald-800"
      
        >
          Users
        </button>
      
      
      <button
       onClick={() => router.push("/sample-users")}
        className="w-full text-left px-4 py-2 rounded-md bg-emerald-900 text-white hover:bg-emerald-800"
         >
            Sample Users
       </button>
</nav>

      {/* Logout */}
      <div className="p-4 border-t border-emerald-900">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
