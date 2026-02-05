

import Layout from "../components/Layout";
import UserTable from "../components/UserTable";

export default function Dashboard() {
  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          Registered Users
        </h1>
        
      </div>

      {/* Content */}
      <UserTable />
    </Layout>
  );
}
