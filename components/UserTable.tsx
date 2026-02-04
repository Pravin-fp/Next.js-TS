

import { useEffect, useState } from "react";

type User = {
  email: string;
  name: string;
  phone: string;
  username: string;
  role: "admin" | "user";
};

export default function UserTable({
  reload,
  onEdit,
}: {
  reload: number;
  onEdit: (user: User) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
      });
  }, [reload]);

  async function del(email: string) {
    if (!confirm("Delete user permanently?")) return;

    const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const msg = await res.text();
      alert("Delete failed: " + msg);
      return;
    }

    setUsers(prev => prev.filter(u => u.email !== email));
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Registered Users</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {users.map(user => (
              <tr
                key={user.email}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">{user.name}</td>
                <td className="px-6 py-3">{user.phone}</td>
                <td className="px-6 py-3 text-center space-x-4">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => del(user.email)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
