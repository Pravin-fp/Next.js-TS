import { useState } from "react";
import Layout from "../components/Layout";
import RentalTable from "../components/RentalTable";
import RentalModal from "../components/RentalModal";
import { RentalUser } from "../types/rental";
export default function RentalPage() {
  const [rentals, setRentals] = useState<RentalUser[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = rentals.filter((r) =>
    r.renterName.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">Rental Users</h1>

      <div className="flex justify-between mb-4">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Search rentals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Add Rental
        </button>
      </div>

      <RentalTable users={filtered} />

      <RentalModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(rental: RentalUser) => {
          setRentals((prev) => [rental, ...prev]); 
          setOpen(false);
        }}
      />
    </Layout>
  );
}
