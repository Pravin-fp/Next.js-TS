
import { useState, useEffect } from "react";
import { RentalUser, PaymentMethod, Rental } from "../types/rental";


type Renter = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (rental: RentalUser) => void;
  renters: Renter[];
initialData?: Rental | null;
};

export default function RentalModal({
  open,
  onClose,
  onSave,
  renters,
  initialData,
}: Props) {

  /* =============================
     EMPTY FORM TEMPLATE
  ============================== */
  const emptyForm: RentalUser = {
    rentalId: "",
    id: "",
    renterName: "",
    email: "",
    phone: "",
    paymentMethods: [
      { id: crypto.randomUUID(), method: "cashapp", value: "" },
    ],
    rentalType: "daily",
    dailyFee: "",
    deposit: "",
    driverType: "uber",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState<RentalUser>(emptyForm);

useEffect(() => {
  if (!initialData) return;
    const selectedRenter = renters.find(
    (r) => r.id === initialData.renterId
  )
  setForm({
    rentalId: initialData.rentalId,
    id: String(initialData.renterId),
    renterName: selectedRenter?.name || "",
    email:selectedRenter?.email ||"" ,
    phone:selectedRenter?.phone ||"" ,
    paymentMethods:
      initialData.paymentMethods?.map((p: any) => ({
        id: p.id,
        method: p.method as "cashapp" | "gpay" | "phonepe",
        value: p.value,
      })) || [
        { id: crypto.randomUUID(), method: "cashapp", value: "" },
      ],
    rentalType: initialData.rentalType,
    dailyFee: initialData.dailyFee,
    deposit: initialData.deposit,
    driverType: initialData.driverType,
    startDate: initialData.startDate,
    endDate: initialData.endDate,
  });
}, [initialData, renters]);



  if (!open) return null;

  /* =============================
     FIELD UPDATE
  ============================== */
  const update = <K extends keyof RentalUser>(
    key: K,
    value: RentalUser[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =============================
     HANDLE RENTER SELECT
  ============================== */
  const handleRenterChange = (renterId: string) => {
    const selected = renters.find(
      (r) => r.id.toString() === renterId
    );

    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      id: renterId,
      renterName: selected.name,
      email: selected.email,
      phone: selected.phone,
    }));
  };

  /* =============================
     PAYMENT METHODS
  ============================== */
  const addPayment = () =>
    setForm((prev) => ({
      ...prev,
      paymentMethods: [
        ...prev.paymentMethods,
        { id: crypto.randomUUID(), method: "cashapp", value: "" },
      ],
    }));

  const updatePayment = (
    id: string,
    field: keyof PaymentMethod,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));

  const removePayment = (id: string) =>
    setForm((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((m) => m.id !== id),
    }));

  /* =============================
     SAVE HANDLER
  ============================== */

const handleSubmit = () => {
  const rentalToSave = initialData
    ? { ...initialData, ...form }
    : form;

  onSave(rentalToSave);
  setForm(emptyForm);
  onClose();
};


  /* =============================
     UI
  ============================== */
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="w-[760px] bg-emerald-50 rounded-xl shadow-xl p-6">
       
        <h2 className="text-xl font-semibold mb-6">
  {initialData ? "Edit Rental" : "Add Rental"}
</h2>


        <div className="grid grid-cols-2 gap-3 mt-4">

          {/* RENTER SELECT */}
          <select
            className="border rounded px-3 py-2"
            value={form.id}
            onChange={(e) => handleRenterChange(e.target.value)}
          >
            <option value="">Select Renter</option>
            {renters.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.status})
              </option>
            ))}
          </select>

          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={form.email}
            readOnly
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            readOnly
          />

          {/* PAYMENT METHODS */}
          <div className="col-span-2">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Payment Methods</span>
              <button
                type="button"
                onClick={addPayment}
                className="text-orange-600 text-sm"
              >
                + Add
              </button>
            </div>

            {form.paymentMethods.map((p) => (
              <div
                key={p.id}
                className="border border-orange-300 rounded-lg p-3 flex items-center gap-3 mb-2"
              >
                <select
                  className="border rounded px-2 py-1"
                  value={p.method}
                  onChange={(e) =>
                    updatePayment(p.id, "method", e.target.value)
                  }
                >
                  <option value="cashapp">Cash App</option>
                  <option value="gpay">Google Pay</option>
                  <option value="phonepe">PhonePe</option>
                </select>

                <input
                  className="border rounded px-3 py-1 flex-1"
                  placeholder="@username or ID"
                  value={p.value}
                  onChange={(e) =>
                    updatePayment(p.id, "value", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => removePayment(p.id)}
                  className="text-red-500"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>

          {/* RENTAL TYPE */}
          <select
            className="border rounded px-3 py-2 col-span-2"
            value={form.rentalType}
            onChange={(e) =>
              update("rentalType", e.target.value as any)
            }
          >
            <option value="daily">Daily Renter</option>
            <option value="weekly">Weekly Renter</option>
          </select>

          <input
            className="border rounded px-3 py-2"
            placeholder="Daily Rental Fee"
            value={form.dailyFee}
            onChange={(e) => update("dailyFee", e.target.value)}
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Deposit"
            value={form.deposit}
            onChange={(e) => update("deposit", e.target.value)}
          />

          <select
            className="border rounded px-3 py-2 col-span-2"
            value={form.driverType}
            onChange={(e) =>
              update("driverType", e.target.value as any)
            }
          >
            <option value="uber">Uber Fleet</option>
            <option value="ola">Ola Fleet</option>
            <option value="rapido">Rapido Fleet</option>
          </select>

          <input
            type="date"
            className="border rounded px-3 py-2"
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />

          <input
            type="date"
            className="border rounded px-3 py-2"
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              onClose();
            }}
            className="px-5 py-2 rounded bg-red-100 text-red-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded bg-green-600 text-white"
          >
            {/* Create */}
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
