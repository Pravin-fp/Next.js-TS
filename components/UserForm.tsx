

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

  // Prefill when editing
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

  const inputClass =
        "w-full rounded-md border border-slate-200 bg-slate-50 " +
        "px-3 py-2 text-slate-800 placeholder-slate-400 " +
        "focus:outline-none focus:ring-2 focus:ring-emerald-500";


  return (
    <form onSubmit={submit} className="space-y-5">
      <h3 className="text-lg font-semibold text-slate-800">
        {editingUser ? "Edit User" : "Add User"}
      </h3>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          disabled={!!editingUser}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`${inputClass} ${
            editingUser ? "bg-slate-100 cursor-not-allowed" : ""
          }`}
          placeholder="user@example.com"
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Name
        </label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="John Doe"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Username
        </label>
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className={inputClass}
          placeholder="john_doe"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Phone
        </label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
          placeholder="9876543210"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Role
        </label>
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value as "admin" | "user" })
          }
          className={inputClass}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md shadow transition"
        >
          {editingUser ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
}
