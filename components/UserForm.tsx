
import { useEffect, useState } from "react";

type User = {
  email: string;
  name: string;
  phone: string;
  username: string;
  role: "admin" | "user";
};

export default function UserForm({
  editingUser,
  onSuccess,
}: {
  editingUser: User | null;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    username: "",
    role: "user",
  });

  // ✅ PRE-FILL FORM WHEN EDITING
  useEffect(() => {
    if (editingUser) {
      setForm({
        email: editingUser.email,
        name: editingUser.name,
        phone: editingUser.phone,
        username: editingUser.username,
        role: editingUser.role,
      });
    }
  }, [editingUser]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const isEdit = Boolean(editingUser);

    const res = await fetch(
      isEdit
        ? `/api/users/${encodeURIComponent(form.email)}`
        : `/api/users`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) {
      const msg = await res.text();
      alert("Save failed: " + msg);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        placeholder="Email"
        value={form.email}
        disabled={!!editingUser} // 🔑 email should not change
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 w-full"
      />

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full"
      />

      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="border p-2 w-full"
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="border p-2 w-full"
      />

      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value as any })}
        className="border p-2 w-full"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2">
        {editingUser ? "Update User" : "Create User"}
      </button>
    </form>
  );
}