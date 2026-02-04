import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 bg-blue-600 p-6">
        <div className="bg-white rounded-lg p-6 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
