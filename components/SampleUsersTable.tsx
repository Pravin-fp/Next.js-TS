import { SampleUser } from "../types/sampleUser";
import { useEffect, useState } from "react";

import { FaEdit, FaTrash } from "react-icons/fa";

type SortField =
  | "email"
  | "name"
  | "phone"
  | "city"
  | "address"
  | "postal"
  | "country"
  | null;

type SortOrder = "asc" | "desc" | null;

type Props = {
  users: SampleUser[];
  onEdit: (user: SampleUser) => void;
  onDelete: (email: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onStatusUpdate: (user: SampleUser) => void;
};


export default function SampleUsersTable({
  users,
  onEdit,
  onDelete,
  sortField,
  sortOrder,
  onSort,
  onStatusUpdate,
}: Props) {
    const SortIcon = ({
  active,
  order,
}: {
  active: boolean;
  order: "asc" | "desc" | null;
}) => {
  if (!active) return <span className="ml-1 text-gray-300">⇅</span>;
  if (order === "asc") return <span className="ml-1">↑</span>;
  return <span className="ml-1">↓</span>;
};
const [editingStatusEmail, setEditingStatusEmail] = useState<string | null>(null);
const [tempStatus, setTempStatus] = useState<"active" | "inactive">("active");

  return (
    
    <div className="border rounded-xl overflow-hidden">
       
      {/* SCROLL CONTAINER */}
      <div className="relative overflow-x-auto overflow-y-auto max-h-[420px]">
        <table className="min-w-[1400px] w-full border-collapse">
          {/* HEADER */}
          <thead className="sticky top-0 z-20 bg-gray-100">
            <tr>
              <th className="sticky left-0 z-30 bg-gray-100 px-4 py-3 text-left w-[260px]" onClick={() => onSort("email")}>
                Email
                <SortIcon active={sortField === "email"} order={sortOrder} />
              </th>
              <th className="sticky left-[260px] z-30 bg-gray-100 px-4 py-3 text-left w-[200px]"onClick={() => onSort("name")} >
                Name
                 <SortIcon active={sortField === "name"} order={sortOrder} />
              </th>
              <th onClick={() => onSort("phone")} className="cursor-pointer">
                Phone <SortIcon active={sortField === "phone"} order={sortOrder} />
                </th>
                <th onClick={() => onSort("city")} className="cursor-pointer">
                City <SortIcon active={sortField === "city"} order={sortOrder} />
                </th>
                <th onClick={() => onSort("address")} className="cursor-pointer">
                Address <SortIcon active={sortField === "address"} order={sortOrder} />
                </th>
                {/* <th className="px-4 py-3 text-left">Address</th> */}
                <th onClick={() => onSort("postal")} className="cursor-pointer">
                Postal <SortIcon active={sortField === "postal"} order={sortOrder} />
                </th>

                <th onClick={() => onSort("country")} className="cursor-pointer">
                Country <SortIcon active={sortField === "country"} order={sortOrder} />
                </th>

              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-t">
                {/* EMAIL */}
                <td className="sticky left-0 z-10 bg-white px-4 py-2 w-[260px]">
                  {u.email}
                </td>

                {/* NAME */}
                <td className="sticky left-[260px] z-10 bg-white px-4 py-2 w-[200px] font-medium">
                  {u.name}
                </td>

                <td className="px-4 py-2">{u.phone}</td>
                <td className="px-4 py-2">{u.city}</td>
                <td className="px-4 py-2">{u.address}</td>
                <td className="px-4 py-2">{u.postal}</td>
                <td className="px-4 py-2">{u.country}</td>

                <td className="px-4 py-2">
  {editingStatusEmail === u.email ? (
    <div className="flex items-center gap-2">
      {/* Dropdown */}
      <select
        value={tempStatus}
        onChange={(e) =>
          setTempStatus(e.target.value as "active" | "inactive")
        }
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* ✔ Save */}
      <button
        onClick={() => {
          onStatusUpdate({ ...u, status: tempStatus });
          setEditingStatusEmail(null);
        }}
        className="bg-green-500 text-white px-2 py-1 rounded"
        title="Save"
      >
        ✓
      </button>

      {/* ✖ Cancel */}
      <button
        onClick={() => setEditingStatusEmail(null)}
        className="bg-red-400 text-white px-2 py-1 rounded"
        title="Cancel"
      >
        ✕
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      {/* Status badge */}
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          u.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {u.status}
      </span>

      {/* Dropdown arrow */}
      <button
        onClick={() => {
          setEditingStatusEmail(u.email);
          setTempStatus(u.status);
        }}
        className="text-gray-400 hover:text-gray-700"
        title="Change status"
      >
        ▼
      </button>
    </div>
  )}
</td>


                <td className="px-4 py-2 space-x-3">
                  <button
                    onClick={() => onEdit(u)}
                    title="Edit"
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(u.email)}
                    title="Delete"
                    className="text-red-600 hover:underline"
                  >
                    <FaTrash size={16} />
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
