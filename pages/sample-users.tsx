import Layout from "../components/Layout";

const users = Array.from({ length: 20 }).map((_, i) => ({
  no: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@gmail.com`,
  phone: `98765432${i}`,
  location: "India",
}));

export default function SampleUsers() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Sample Users</h1>

      {/* TABLE CONTAINER */}
      <div className="relative border border-slate-200 rounded-xl overflow-hidden">
        {/* Scroll container */}
        <div className="max-h-[420px] overflow-x-auto overflow-y-auto">
          <table className="min-w-[1200px] table-fixed border-collapse">
            {/* TABLE HEADER */}
            <thead className="sticky top-0 z-20 bg-slate-100">
              <tr>
                <th className="sticky left-0 z-40 bg-slate-100 px-4 py-3 "style={{ width: 80 }}>
                  No
                </th>
                <th className="px-6 py-3 border">Name</th>
                <th className="px-6 py-3 border">Email</th>
                <th className="px-6 py-3 border">Phone</th>
                <th className="px-6 py-3 border">Location</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {users.map((u) => (
                <tr key={u.no} className="hover:bg-slate-50">
                  {/* FIXED FIRST COLUMN */}
                  <td className="sticky left-0 bg-white z-10 px-4 py-3 border font-medium">
                    {u.no}
                  </td>

                  <td className="px-6 py-3 border">{u.name}</td>
                  <td className="px-6 py-3 border">{u.email}</td>
                  <td className="px-6 py-3 border">{u.phone}</td>
                  <td className="px-6 py-3 border">{u.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
