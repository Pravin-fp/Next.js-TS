import { Rental,RentalUser } from "../types/rental";
type Props = {
  users: Rental[];
  onEdit: (rental: Rental) => void;
  onDelete: (id: string) => void;
  
};
export default function RentalTable({ users,
  onEdit,
  onDelete,}: Props) {
  return (
    <div className="border rounded overflow-auto max-h-[500px]">
      <table className="min-w-[1200px] w-full">
        <thead className="sticky top-0 bg-gray-100 z-20">
          <tr>
            {/* NAME (sticky) */}
            <th className="sticky left-0 bg-gray-100 px-4 py-2 w-[220px]">
              Name
            </th>

            <th className="px-4 py-2">Payment</th>
            <th className="px-4 py-2">Renter Type</th>
            <th className="px-4 py-2">Daily Fee</th>
            <th className="px-4 py-2">Deposit</th>
            <th className="px-4 py-2">Driver Type</th>
            <th className="px-4 py-2">Start</th>
            <th className="px-4 py-2">End</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.rentalId} className="border-t">
              {/* NAME */}
              <td className="sticky left-0 bg-white px-4 py-2 font-medium">
                {u.renterId}
              </td>

              {/* PAYMENT METHODS */}
              <td className="px-4 py-2">
                {u.paymentMethods.map((pm) => (
                  <div key={pm.id} className="text-sm">
                    {pm.method} – {pm.value}
                  </div>
                ))}
              </td>

              <td className="px-4 py-2 capitalize">{u.rentalType}</td>
              <td className="px-4 py-2">₹{u.dailyFee}</td>
              <td className="px-4 py-2">₹{u.deposit}</td>
              <td className="px-4 py-2 capitalize">{u.driverType}</td>
              <td className="px-4 py-2">{u.startDate}</td>
              <td className="px-4 py-2">{u.endDate}</td>

              {/* ACTIONS */}
              <td className="px-4 py-2 space-x-3">
                
                <button type="button"
                  onClick={() => onEdit(u)}  className="text-green-600 hover:text-green-800 cursor-pointer">
                  ✏️
                </button>
                
                <button  type="button"
                  onClick={() => onDelete(u.rentalId)} className="text-red-600 hover:text-red-800 cursor-pointer">
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}