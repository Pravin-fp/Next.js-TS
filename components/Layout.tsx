
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 min-h-screen p-6 overflow-y-auto bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="bg-white shadow-xl rounded-xl border border-emerald-200 p-6">
      {children}
  </div>
</main>

    </>
  );
}
