import { useEffect, useState } from "react";
import { SampleUser } from "../types/sampleUser";
type Props = {
  open: boolean;
  user: SampleUser | null; 
  onClose: () => void;
  onSave: (user: SampleUser) => void;
};

export default function SampleUserModal({
  open,
  user,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<SampleUser>({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    postal: "",
    country: "",
    status: "active",
     createdAt: "",
  });
useEffect(() => {
  if (open) {
    if (user) {
      setForm(user); // Edit
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        postal: "",
        country: "",
        status: "active",
         createdAt: "",
      });
    }
  }
}, [user, open]); 

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-xl w-[520px] p-6 shadow-2xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Edit User" : "Add User"}
        </h2>

        <div className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
            value={form.email}
            disabled={!!user} 
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />


          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Postal Code"
            value={form.postal}
            onChange={(e) =>
              setForm({ ...form, postal: e.target.value })
            }
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Country"
            value={form.country}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value })
            }
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as "active" | "inactive",
              })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="  px-4 py-2 rounded
    bg-red-50 text-red-600
    border border-red-200
    hover:bg-red-100
    hover:text-red-700
    transition
  ">
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {user ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}



