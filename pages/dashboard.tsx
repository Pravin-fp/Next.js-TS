
import Layout from "../components/Layout";
import UserTable from "../components/UserTable";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <UserTable />
    </Layout>
  );
}
