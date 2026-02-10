import { useState } from "react";
import { RentalUser, PaymentMethod } from "../types/rental";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (rental: RentalUser) => void;
};

export default function RentalModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<RentalUser>({
    id: crypto.randomUUID(),
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
  });

  if (!open) return null;

  const update = <K extends keyof RentalUser>(
    key: K,
    value: RentalUser[K]
  ) => setForm((p) => ({ ...p, [key]: value }));

  /* PAYMENT METHODS */
  const addPayment = () =>
    setForm((p) => ({
      ...p,
      paymentMethods: [
        ...p.paymentMethods,
        { id: crypto.randomUUID(), method: "cashapp", value: "" },
      ],
    }));

  const updatePayment = (id: string, value: string) =>
    setForm((p) => ({
      ...p,
      paymentMethods: p.paymentMethods.map((m) =>
        m.id === id ? { ...m, value } : m
      ),
    }));

  const removePayment = (id: string) =>
    setForm((p) => ({
      ...p,
      paymentMethods: p.paymentMethods.filter((m) => m.id !== id),
    }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="w-[760px] bg-emerald-50 rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Add Rental</h2>

        {/* FORM GRID */}
        <div className="grid grid-cols-2 gap-3 mt-44">
          {/* RENTER */}
          <select
            className="border rounded px-3 py-2"
            value={form.renterName}
            onChange={(e) => update("renterName", e.target.value)}
          >
            <option value="">Select Renter</option>
            <option value="John">John</option>
            <option value="Alex">Alex</option>
            <option value="Ravi">Ravi</option>
          </select>

          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />

          {/* PAYMENT METHODS */}
          <div className="col-span-2">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Payment Methods</span>
              <button
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
                <select className="border rounded px-2 py-1">
                  <option value="cashapp">💰 Cash App</option>
                </select>

                <input
                  className="border rounded px-3 py-1 flex-1"
                  placeholder="@username or ID"
                  value={p.value}
                  onChange={(e) => updatePayment(p.id, e.target.value)}
                />

                <button
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
            onChange={(e) => update("rentalType", e.target.value as any)}
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
            onChange={(e) => update("driverType", e.target.value as any)}
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

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-red-100 text-red-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 rounded bg-green-600 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
