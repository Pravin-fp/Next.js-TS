
import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import Modal from "./Modal";

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

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
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

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Registered Users</h2>

        <button
          onClick={() => {
            setEditingUser(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.email} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.phone}</td>
              <td className="p-2 space-x-3">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setEditingUser(u);
                    setOpen(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="text-red-600"
                  onClick={() => deleteUser(u.email)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
