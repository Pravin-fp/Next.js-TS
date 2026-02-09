
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import SampleUsersTable from "../components/SampleUsersTable";
import SampleUserModal from "../components/SampleUserModal";
import { SampleUser } from "../types/sampleUser";
import {
  getSampleUsers,
  createSampleUser,
  updateSampleUser,
  deleteSampleUser,
} from "../lib/sampleUsersApi";

/* 🔽 SORT OPTIONS */
type SortOption =
    "latest"
  | "none"
  | "name-asc"
  | "name-desc"
  | "email-asc"
  | "email-desc"
  | "phone-asc"
  | "phone-desc";

export default function SampleUsersPage() {
  const [users, setUsers] = useState<SampleUser[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SampleUser | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [sortField, setSortField] = useState<
  "email" | "name" | "phone" | "city" | "address" | "postal" | "country" | null
>(null);

const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);


  /* 🔄 LOAD USERS */
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getSampleUsers();
    setUsers(data);
  };


const handleCreate = async (user: SampleUser) => {
  const newUser = {
    ...user,
    createdAt: new Date().toISOString(), // ✅ important
  };

  await createSampleUser(newUser);
  await loadUsers();
  setOpen(false);
};


  /* ✏️ EDIT */
  const handleEdit = (user: SampleUser) => {
    setEditingUser(user);
    setOpen(true);
  };
  const handleStatusUpdate = async (user: SampleUser) => {
  await updateSampleUser(user.email, user);
  await loadUsers();
};


  /* 💾 UPDATE */
  const handleUpdate = async (user: SampleUser) => {
    await updateSampleUser(user.email, user);
    await loadUsers();
    setEditingUser(null);
    setOpen(false);
  };

  /* ❌ DELETE */
  const handleDelete = async (email: string) => {
    if (!confirm("Delete user permanently?")) return;
    await deleteSampleUser(email);
    await loadUsers();
  };

  /* 🔍 SEARCH (ALL FIELDS) */
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();

    return (
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q) ||
      u.address.toLowerCase().includes(q) ||
      u.postal.toLowerCase().includes(q) ||
      u.country.toLowerCase().includes(q)
    );
  });

const sortedUsers = [...filteredUsers].sort((a, b) => {
  // ✅ DEFAULT: newest first
  if (!sortField || !sortOrder) {
    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  }

  // 🔢 Numeric fields
  if (sortField === "phone" || sortField === "postal") {
    const aNum = Number(a[sortField]);
    const bNum = Number(b[sortField]);
    return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
  }

  // 🔤 String fields
  const aVal = a[sortField]?.toString().toLowerCase() || "";
  const bVal = b[sortField]?.toString().toLowerCase() || "";

  return sortOrder === "asc"
    ? aVal.localeCompare(bVal)
    : bVal.localeCompare(aVal);
});

return (
    <Layout>
      {/* 🔰 PAGE TITLE */}
      <h1 className="text-xl font-semibold mb-4">Render Users</h1>

      {/* 🔍 SEARCH + SORT + ADD */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
        </div>

        <button
          onClick={() => {
            setEditingUser(null); // 🔥 RESET FORM FOR ADD
            setOpen(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>


<SampleUsersTable
  users={sortedUsers}
  onEdit={handleEdit}
  onDelete={handleDelete}
  sortField={sortField}
  sortOrder={sortOrder}
  onStatusUpdate={handleStatusUpdate}
  onSort={(field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  }}
/>

      {/* 🧾 MODAL */}
      <SampleUserModal
        open={open}
        user={editingUser}
        onClose={() => {
          setOpen(false);
          setEditingUser(null);
        }}
        onSave={editingUser ? handleUpdate : handleCreate}
      />
    </Layout>
  );
}
