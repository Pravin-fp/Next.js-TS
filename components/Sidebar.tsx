

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
    <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      <nav className="space-y-3">
        <div className="cursor-pointer hover:text-blue-300">
         <button>Users</button> 
        </div>
        
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        Logout
      </button>
    </aside>
  );
}
