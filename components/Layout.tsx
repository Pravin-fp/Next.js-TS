
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 min-h-screen p-6 overflow-y-auto">
        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-emerald-200 p-6">
          {children}
        </div>
      </main>
    </>
  );
}
