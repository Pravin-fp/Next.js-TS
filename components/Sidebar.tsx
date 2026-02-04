
export default function Sidebar({
  setView,
}: {
  setView: (view: "form" | "users") => void;
}) {
  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-blue-700">
        <h2 className="text-xl font-semibold tracking-wide">Menu</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => setView("users")}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Users
        </button>

        <button
          onClick={() => setView("form")}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register User
        </button>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-700">
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-medium"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
