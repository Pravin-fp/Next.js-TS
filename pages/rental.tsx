
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import RentalTable from "../components/RentalTable";
import RentalModal from "../components/RentalModal";
import { RentalUser, Renter, Rental } from "../types/rental";
import { getRentals, createRental } from "../lib/rentalsApi";
import { getSampleUsers } from "../lib/sampleUsersApi";

export default function RentalPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [renters, setRenters] = useState<Renter[]>([]);

  /* =============================
     LOAD RENTALS
  ============================== */
  useEffect(() => {
    async function loadRentals() {
      try {
        const data = await getRentals();
        setRentals(data);
      } catch (err) {
        console.error("Failed to load rentals");
      }
    }

    loadRentals();
  }, []);

  /* =============================
     LOAD RENTERS
  ============================== */
  useEffect(() => {
    async function loadRenters() {
      try {
        const data = await getSampleUsers();

        const formattedRenters: Renter[] = data.map(
          (u: any, index: number) => ({
            id: u.id ?? index + 1,
            name: u.name,
            email: u.email,
            phone: u.phone,
            status: u.status,
          })
        );

        setRenters(formattedRenters);
      } catch (err) {
        console.error("Failed to load renters");
      }
    }

    loadRenters();
  }, []);

  /* =============================
     SEARCH FILTER
  ============================== */
  const filtered = rentals.filter((r) => {
    const renter = renters.find(
      (ren) => ren.id === r.renterId
    );

    const renterName = renter?.name || "";

    return renterName
      .toLowerCase()
      .includes(search.toLowerCase());
  });


const handleSave = async (form: RentalUser) => {
  try {
    const payload = {
      renterId: Number(form.id), // convert id → renterId
      paymentMethods: form.paymentMethods,
      rentalType: form.rentalType,
      dailyFee: form.dailyFee,
      deposit: form.deposit,
      driverType: form.driverType,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    const saved = await createRental(payload);

    setRentals((prev) => [saved, ...prev]);
    setOpen(false);
  } catch (err) {
    console.error("Save failed");
  }
};

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">
        Rental Users
      </h1>

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

      <RentalTable
        users={filtered}
      />

      <RentalModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        renters={renters}
      />
    </Layout>
  );
}
