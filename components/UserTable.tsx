
import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import Modal from "./Modal";
import { FaEdit, FaTrash } from "react-icons/fa";

type User = {
  email: string;
  name: string;
  phone: string;
  username: string;
  role: "admin" | "user";
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

const [sortOpen, setSortOpen] = useState(false);
const [sortBy, setSortBy] = useState<
  "none" | "email-asc" | "email-desc" | "name-asc" | "name-desc" | "phone-asc" | "phone-desc"
>("none");


  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    console.log("API RESPONSE:", data);
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function deleteUser(email: string) {
    if (!confirm("Delete this user?")) return;

    await fetch(`/api/users/${encodeURIComponent(email)}`, {
      method: "DELETE",
    });

    loadUsers();
  }

const filteredAndSortedUsers = users
  .filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q)
    );
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "email-asc":
        return a.email.localeCompare(b.email);
      case "email-desc":
        return b.email.localeCompare(a.email);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "phone-asc":
        return a.phone.localeCompare(b.phone);
      case "phone-desc":
        return b.phone.localeCompare(a.phone);
      default:
        return 0;
    }
  });

  
  if (loading)
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-slate-600">
        Loading users...
      </div>
    );

  return (
    <>
    
      <div className="flex items-center justify-between mb-4">
   
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 px-3 py-2 text-sm rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
    
          <div className="relative">
  <button
    onClick={() => setSortOpen(!sortOpen)}
    className="flex items-center gap-2 border border-emerald-500 text-emerald-700 px-3 py-2 rounded-md bg-white hover:bg-emerald-50"
  >
    ⬍ Sort by
  </button>

  {sortOpen && (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
      {[
        { label: "No sorting", value: "none" },
        { label: "Alphabetical", value: "email-asc", hint: "A → Z" },
        { label: "Reverse alphabetical", value: "email-desc", hint: "Z → A" },
        { label: "Name - Ascending", value: "name-asc", hint: "A → Z" },
        { label: "Name - Descending", value: "name-desc", hint: "Z → A" },
        { label: "Phone - Ascending", value: "phone-asc", hint: "Low → High" },
        { label: "Phone - Descending", value: "phone-desc", hint: "High → Low" },
      ].map((item) => (
        <button
          key={item.value}
          onClick={() => {
            setSortBy(item.value as any);
            setSortOpen(false);
          }}
          className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-50"
        >
          <span>{item.label}</span>

          <div className="flex items-center gap-2">
            {item.hint && (
              <span className="text-slate-400 text-xs">
                {item.hint}
              </span>
            )}
            {sortBy === item.value && (
              <span className="text-emerald-600 font-bold">✓</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )}
</div>


        <button
          onClick={() => {
            setEditingUser(null);
            setOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add User
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Phone</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
           
            {filteredAndSortedUsers.map((u) => (

              <tr
                key={u.email}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-5 py-4 text-slate-700">{u.email}</td>

                <td className="px-5 py-4 font-medium text-slate-800">
                  {u.name}
                </td>

                <td className="px-5 py-4 text-slate-700">{u.phone}</td>

                <td className="px-5 py-4 space-x-4">
                  <button
                    onClick={() => {
                      setEditingUser(u);
                      setOpen(true);
                    }}
                    title="Edit"
                    className="text-emerald-600 hover:underline"
                  >
                    {/* Edit */}
                     <FaEdit size={16} />
                  </button>

                  <button
                    onClick={() => deleteUser(u.email)}
                     title="Delete"
                    className="text-red-500 hover:underline"
                  >
                    {/* Delete */}
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <UserForm
          editingUser={editingUser}
          onSuccess={() => {
            setOpen(false);
            loadUsers();
          }}
        />
      </Modal>
    </>
  );
}



