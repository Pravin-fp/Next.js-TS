
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-emerald-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-emerald-200 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
