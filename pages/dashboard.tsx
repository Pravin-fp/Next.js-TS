
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

export default function Dashboard() {
  const [view, setView] = useState<"users" | "form">("users");
  const [reload, setReload] = useState(0);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  return (
    <div className="flex min-h-screen">
      <Sidebar setView={setView} />

      <main className="flex-1 p-10 bg-blue-600">
        <h1 className="text-white text-2xl mb-6">Dashboard</h1>

        <div className="bg-white p-6 rounded">
          {view === "form" && (
            <UserForm
              editingUser={editingUser}
              onSuccess={() => {
                setEditingUser(null);
                setView("users");
                setReload(v => v + 1);
              }}
            />
          )}

          {view === "users" && (
            <UserTable
              reload={reload}
              onEdit={(user) => {
                setEditingUser(user);
                setView("form");
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}